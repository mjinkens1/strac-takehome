import { render, screen } from "@testing-library/react";
import { DownloadIcon } from "./DownloadIcon";

// Mock the Tooltip component
jest.mock("../../../../components/Tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => children,
}));

describe("DownloadIcon", () => {
  it("renders check icon when downloaded", () => {
    render(<DownloadIcon downloaded={true} downloading={false} progress={0} />);
    const checkIcon = screen.getByTestId("check-icon");
    expect(checkIcon).toBeInTheDocument();
    expect(checkIcon).toHaveClass("text-green-500");
  });

  it("renders progress circle when downloading", () => {
    const progress = 50;
    const { container } = render(
      <DownloadIcon downloaded={false} downloading={true} progress={progress} />
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 36 36");

    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(2);

    // Check progress circle properties
    const progressCircle = circles[1];
    expect(progressCircle).toHaveAttribute("strokeLinecap", "round");
    expect(progressCircle).toHaveClass("stroke-blue-600");

    // Verify progress calculation
    const circumference = 2 * Math.PI * 16;
    const expectedOffset = circumference * (1 - progress / 100);
    expect(progressCircle).toHaveAttribute(
      "strokeDashoffset",
      expectedOffset.toString()
    );
  });

  it("renders download icon by default", () => {
    render(
      <DownloadIcon downloaded={false} downloading={false} progress={0} />
    );
    const downloadIcon = screen.getByTestId("download-icon");
    expect(downloadIcon).toBeInTheDocument();
  });

  it("matches snapshot for each state", () => {
    const { container: downloadedContainer } = render(
      <DownloadIcon downloaded={true} downloading={false} progress={0} />
    );
    expect(downloadedContainer).toMatchSnapshot("downloaded");

    const { container: downloadingContainer } = render(
      <DownloadIcon downloaded={false} downloading={true} progress={50} />
    );
    expect(downloadingContainer).toMatchSnapshot("downloading");

    const { container: defaultContainer } = render(
      <DownloadIcon downloaded={false} downloading={false} progress={0} />
    );
    expect(defaultContainer).toMatchSnapshot("default");
  });
});
