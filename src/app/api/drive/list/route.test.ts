/**
 * @jest-environment node
 */
import { google } from 'googleapis';
import { getServerSession } from 'next-auth';

import { GET as listRoute } from './route';

jest.mock('next-auth');
jest.mock('googleapis');

const mockSession = { accessToken: 'token' };

beforeEach(() => {
  jest.resetAllMocks();
});

describe('/api/drive/list', () => {
  it('returns 401 if not authenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const res = await listRoute(new Request('http://localhost'));
    expect(res.status).toBe(401);
  });

  it('returns file list', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const listMock = jest.fn().mockResolvedValue({ data: { files: [{ id: '1', name: 'Test' }] } });
    const authMock = { setCredentials: jest.fn() };
    (google.auth.OAuth2 as unknown as jest.Mock).mockImplementation(() => authMock);
    (google.drive as unknown as jest.Mock).mockReturnValue({
      files: { list: listMock },
    });

    const res = await listRoute(new Request('http://localhost'));
    expect(res.status).toBe(200);
  });
});
