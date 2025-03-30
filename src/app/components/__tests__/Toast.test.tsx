import { act, render, screen, waitFor } from '@testing-library/react';
import { FC } from 'react';

import { ToastManager, useToast } from '../Toast';

// Test component that uses the toast
const TestComponent: FC = () => {
  const addToast = useToast();

  return <button onClick={() => addToast({ message: 'Test message' })}>Show Toast</button>;
};

describe('Toast', () => {
  beforeEach(() => {
    // Reset the timer mocks before each test
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render children', () => {
    render(
      <ToastManager>
        <div data-testid="child">Child content</div>
      </ToastManager>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should show and hide toast message', async () => {
    render(
      <ToastManager>
        <TestComponent />
      </ToastManager>,
    );

    // Click button to show toast
    screen.getByRole('button').click();

    // Check if toast is visible
    expect(await screen.findByText('Test message')).toBeInTheDocument();

    // Fast-forward time to trigger toast removal
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    // Verify toast is removed
    await waitFor(() => {
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });
  });
});
