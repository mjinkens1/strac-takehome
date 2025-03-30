import { render, screen, fireEvent } from "@testing-library/react";
import { FileActions } from "../FileActions";

// Mock the Tooltip component
jest.mock("../../../../../components/Tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => children,
}));

describe("FileActions", () => {
  const mockProps = {
    fileId: "123",
    fileName: "test.pdf",
    onDelete: jest.fn(),
    onDownload: jest.fn(),
    downloading: false,
    downloaded: false,
    progress: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders download and delete buttons", () => {
    render(<FileActions {...mockProps} />);

    const downloadLink = screen.getByRole("link");
    expect(downloadLink).toHaveAttribute(
      "href",
      `/api/drive/download?id=${mockProps.fileId}&name=${encodeURIComponent(
        mockProps.fileName
      )}`
    );
    expect(downloadLink).toHaveAttribute("download", mockProps.fileName);

    const deleteButton = screen.getByRole("button");
    expect(deleteButton).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", () => {
    render(<FileActions {...mockProps} />);

    const deleteButton = screen.getByRole("button");
    fireEvent.click(deleteButton);

    expect(mockProps.onDelete).toHaveBeenCalledWith(mockProps.fileId);
  });

  it("calls onDownload when download link is clicked", () => {
    render(<FileActions {...mockProps} />);

    const downloadLink = screen.getByRole("link");
    fireEvent.click(downloadLink);

    expect(mockProps.onDownload).toHaveBeenCalled();
  });

  it("disables download link when downloading or downloaded", () => {
    const { rerender } = render(
      <FileActions {...mockProps} downloading={true} />
    );
    expect(screen.getByRole("link")).toHaveClass("pointer-events-none");

    rerender(<FileActions {...mockProps} downloaded={true} />);
    expect(screen.getByRole("link")).toHaveClass("pointer-events-none");
  });

  it("matches snapshot", () => {
    const { container } = render(<FileActions {...mockProps} />);
    expect(container).toMatchSnapshot();
  });
});
