import { render } from "@testing-library/react";
import { GoogleIcon } from "./GoogleIcon";

describe("GoogleIcon", () => {
  it("renders the SVG with correct attributes", () => {
    const { container } = render(<GoogleIcon />);
    const svg = container.querySelector("svg");

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
  });

  it("contains all required paths with correct colors", () => {
    const { container } = render(<GoogleIcon />);
    const paths = container.querySelectorAll("path");

    expect(paths).toHaveLength(5); // 4 colored paths + 1 transparent

    const colors = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "none"];
    paths.forEach((path, index) => {
      expect(path).toHaveAttribute("fill", colors[index]);
    });
  });

  it("matches snapshot", () => {
    const { container } = render(<GoogleIcon />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
