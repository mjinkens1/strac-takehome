import { render } from "@testing-library/react";
import { Providers } from "./Providers";

// Mock next-auth SessionProvider
jest.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock ToastManager component
jest.mock("../Toast", () => ({
  ToastManager: ({ children }: { children: React.ReactNode }) => children,
}));

describe("Providers", () => {
  it("renders children correctly", () => {
    const testChild = <div data-testid="test-child">Test Content</div>;

    const { getByTestId } = render(<Providers>{testChild}</Providers>);

    expect(getByTestId("test-child")).toBeInTheDocument();
    expect(getByTestId("test-child")).toHaveTextContent("Test Content");
  });
});
