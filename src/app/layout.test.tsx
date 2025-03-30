import { render } from "@testing-library/react";
import RootLayout from "./layout";

// Mock the next/font/google imports since they're not available in test environment
jest.mock("next/font/google", () => ({
  Geist: () => ({
    variable: "mocked-geist-sans",
  }),
  Geist_Mono: () => ({
    variable: "mocked-geist-mono",
  }),
}));

// Mock the Providers component
jest.mock("./components/Providers", () => ({
  Providers: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("RootLayout", () => {
  it("renders children within the layout", () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>
    );

    // Check if the HTML lang attribute is set correctly
    expect(container.firstChild).toHaveAttribute("lang", "en");

    // Check if favicon link is present
    const favicon = container.querySelector('link[rel="shortcut icon"]');
    expect(favicon).toHaveAttribute("href", "/favicon.svg");

    // Check if body has the correct classes
    const body = container.querySelector("body");
    expect(body?.className).toContain("mocked-geist-sans");
    expect(body?.className).toContain("mocked-geist-mono");
    expect(body?.className).toContain("antialiased");

    // Check if children are rendered
    expect(
      container.querySelector('[data-testid="test-child"]')
    ).toBeInTheDocument();
  });
});
