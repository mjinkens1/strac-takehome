import { fireEvent, render, screen } from '@testing-library/react';
import { signOut, useSession } from 'next-auth/react';

import { UserMenu } from './UserMenu';

// Mock next-auth
jest.mock('next-auth/react');

// Mock the signOut function
const mockSignOut = jest.fn();
(signOut as jest.Mock).mockImplementation(mockSignOut);

describe('UserMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user name when available', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      },
    });

    render(<UserMenu />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders email when name is not available', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          email: 'john@example.com',
        },
      },
    });

    render(<UserMenu />);
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('does not render name/email when session data is empty', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
    });

    render(<UserMenu />);
    expect(screen.queryByText('john@example.com')).not.toBeInTheDocument();
  });

  it('calls signOut when clicking the sign out button', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'John Doe',
        },
      },
    });

    render(<UserMenu />);

    // Click the menu button to open the dropdown
    fireEvent.click(screen.getByRole('button'));

    // Click the sign out button
    fireEvent.click(screen.getByText('Sign out'));

    expect(mockSignOut).toHaveBeenCalled();
  });
});
