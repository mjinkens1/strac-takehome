import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { useToast } from '../../components/Toast';
import DashboardPage from '../page';

// Mock the next-auth and next/navigation
jest.mock('next-auth/react');
jest.mock('next/navigation');
jest.mock('../../components/Toast');

// Mock fetch
global.fetch = jest.fn();

describe('DashboardPage', () => {
  const mockRouter = {
    replace: jest.fn(),
  };
  const mockAddToast = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useToast as jest.Mock).mockReturnValue(mockAddToast);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ files: [], nextPageToken: null }),
    });
  });

  it('redirects to login when unauthenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      status: 'unauthenticated',
    });

    render(<DashboardPage />);
    expect(mockRouter.replace).toHaveBeenCalledWith('/login');
  });

  it('shows loading state initially when authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      status: 'authenticated',
    });

    render(<DashboardPage />);
    expect(screen.getByTestId('progress-container')).toBeInTheDocument();
  });

  it('displays empty state when no files', async () => {
    (useSession as jest.Mock).mockReturnValue({
      status: 'authenticated',
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('No files uploaded yet.')).toBeInTheDocument();
    });
  });

  it('displays files when they exist', async () => {
    (useSession as jest.Mock).mockReturnValue({
      status: 'authenticated',
    });

    const mockFiles = [
      {
        id: '1',
        name: 'test.pdf',
        mimeType: 'application/pdf',
        createdTime: '2024-01-01',
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ files: mockFiles, nextPageToken: null }),
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });
  });

  it('handles file deletion', async () => {
    (useSession as jest.Mock).mockReturnValue({
      status: 'authenticated',
    });

    const mockFiles = [
      {
        id: '1',
        name: 'test.pdf',
        mimeType: 'application/pdf',
        createdTime: '2024-01-01',
      },
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ files: mockFiles, nextPageToken: null }),
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    // Find and click delete button (you'll need to add a test-id to the delete button)
    const deleteButton = screen.getByTestId('delete-button-1');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith({
        message: 'Deleted test.pdf',
        type: 'success',
      });
    });
  });

  it('handles API errors', async () => {
    (useSession as jest.Mock).mockReturnValue({
      status: 'authenticated',
    });

    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load files')).toBeInTheDocument();
    });
  });
});
