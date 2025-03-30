import { render, screen, act, waitFor } from "@testing-library/react";
import { ToastManager, useToast } from "./Toast";
import { FC } from "react";

// Test component that uses the toast
const TestComponent: FC = () => {
  const addToast = useToast();

  return (
    <button onClick={() => addToast({ message: "Test message" })}>
      Show Toast
    </button>
  );
};

describe("Toast", () => {
  beforeEach(() => {
    // Reset the timer mocks before each test
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should render children", () => {
    render(
      <ToastManager>
        <div data-testid="child">Child content</div>
      </ToastManager>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("should show and hide toast message", async () => {
    render(
      <ToastManager>
        <TestComponent />
      </ToastManager>
    );

    // Click button to show toast
    screen.getByRole("button").click();

    // Check if toast is visible
    expect(screen.getByText("Test message")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /check/i })).toBeInTheDocument();

    // Fast-forward time to trigger toast removal
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    // Verify toast is removed
    await waitFor(() => {
      expect(screen.queryByText("Test message")).not.toBeInTheDocument();
    });
  });

  it("should show error toast with correct icon", () => {
    const TestErrorComponent: FC = () => {
      const addToast = useToast();
      return (
        <button
          onClick={() => addToast({ message: "Error message", type: "error" })}
        >
          Show Error Toast
        </button>
      );
    };

    render(
      <ToastManager>
        <TestErrorComponent />
      </ToastManager>
    );

    // Click button to show error toast
    screen.getByRole("button").click();

    // Check if error toast is visible with correct icon
    expect(screen.getByText("Error message")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /exclamation/i })
    ).toBeInTheDocument();
  });

  it("should throw error when useToast is used outside ToastManager", () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, "error");
    consoleSpy.mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useToast must be used within <ToastManager>");

    consoleSpy.mockRestore();
  });
});
