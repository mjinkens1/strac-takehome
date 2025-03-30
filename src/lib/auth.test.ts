import { Account, Session, User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';

import { authOptions } from './auth';

// Mock environment variables
process.env.GOOGLE_CLIENT_ID = 'mock-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'mock-client-secret';
process.env.NEXTAUTH_SECRET = 'mock-secret';

// Mock fetch function
global.fetch = jest.fn();

describe('auth configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have Google provider configured', () => {
    expect(authOptions.providers).toHaveLength(1);
    expect(authOptions.providers[0].id).toBe('google');
  });

  describe('jwt callback', () => {
    it('should handle initial token creation', async () => {
      const token = {};
      const account: Account = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: 1234567890,
        providerAccountId: '123',
        provider: 'google',
        type: 'oauth' as const,
      };

      const result = await authOptions.callbacks!.jwt!({
        token,
        account,
        user: {} as User,
      });

      expect(result).toEqual({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: 1234567890000,
      });
    });

    it('should return valid token without refreshing', async () => {
      const token = {
        accessToken: 'valid-token',
        expiresAt: Date.now() + 3600000, // 1 hour from now
      };

      const result = await authOptions.callbacks!.jwt!({
        token,
        user: {} as User,
        account: null,
      });

      expect(result).toEqual(token);
    });

    it('should refresh expired token', async () => {
      const mockFetch = global.fetch as jest.Mock;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            access_token: 'new-access-token',
            expires_in: 3600,
          }),
      });

      const token = {
        accessToken: 'expired-token',
        refreshToken: 'refresh-token',
        expiresAt: Date.now() - 1000, // expired
      };

      const result = await authOptions.callbacks!.jwt!({
        token,
        user: {} as User,
        account: null,
      });

      expect(result.accessToken).toBe('new-access-token');
      expect(result.expiresAt).toBeGreaterThan(Date.now());
    });

    it('should handle token refresh failure by returning original token', async () => {
      const mockFetch = global.fetch as jest.Mock;
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      const originalToken = {
        accessToken: 'expired-token',
        refreshToken: 'refresh-token',
        expiresAt: Date.now() - 1000, // expired
      };

      const result = await authOptions.callbacks!.jwt!({
        token: originalToken,
        user: {} as User,
        account: null,
      });

      expect(result).toEqual({
        ...originalToken,
        error: 'RefreshAccessTokenError',
      });
      expect(mockFetch).toHaveBeenCalled();
    });

    it('should successfully refresh an expired token', async () => {
      const mockFetch = global.fetch as jest.Mock;
      const newAccessToken = 'new-access-token';
      const expiresIn = 3600; // 1 hour in seconds

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            access_token: newAccessToken,
            expires_in: expiresIn,
          }),
      });

      const originalToken = {
        accessToken: 'expired-token',
        refreshToken: 'refresh-token',
        expiresAt: Date.now() - 1000, // expired
      };

      const result = await authOptions.callbacks!.jwt!({
        token: originalToken,
        user: {} as User,
        account: null,
      });

      expect(result).toEqual({
        ...originalToken,
        accessToken: newAccessToken,
        expiresAt: expect.any(Number),
      });

      // Verify the new expiration time is roughly correct (within 1 second tolerance)
      const expectedExpiry = Date.now() + expiresIn * 1000;
      expect(result.expiresAt).toBeGreaterThan(expectedExpiry - 1000);
      expect(result.expiresAt).toBeLessThan(expectedExpiry + 1000);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://oauth2.googleapis.com/token',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );
    });
  });

  describe('session callback', () => {
    it('should add accessToken to session', async () => {
      const session = {
        user: { name: 'Test User' },
        expires: new Date().toISOString(),
      };
      const token = { accessToken: 'test-token' };

      const result = await authOptions.callbacks!.session!({
        session,
        token,
        trigger: 'update',
        newSession: session,
        user: {} as AdapterUser,
      });

      expect((result as Session & { accessToken: string }).accessToken).toBe('test-token');
    });
  });
});
