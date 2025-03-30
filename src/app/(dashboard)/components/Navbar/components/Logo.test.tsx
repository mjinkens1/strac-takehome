import { render, screen } from "@testing-library/react";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("renders the logo with correct text and icon", () => {
    render(<Logo />);

    // Check if the text is rendered
    expect(screen.getByText("Strac Takehome")).toBeInTheDocument();

    // Check if the SVG icon is rendered
    expect(document.querySelector("svg")).toBeInTheDocument();

    // Verify the container has the expected classes
    const container = screen.getByText("Strac Takehome").parentElement;
    expect(container).toHaveClass("flex", "items-center", "gap-2");
  });
});
