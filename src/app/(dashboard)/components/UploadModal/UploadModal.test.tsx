import { render, screen, fireEvent } from "@testing-library/react";
import { UploadModal } from "./UploadModal";
import { DriveFile } from "../../types";

// Mock the TopProgressBar component
jest.mock("@/app/components/TopProgress", () => ({
  TopProgressBar: () => <div data-testid="top-progress-bar" />,
}));

// Mock the UploadForm component
jest.mock("../components/UploadForm", () => ({
  UploadForm: ({
    onSuccess,
    onAllSuccess,
  }: {
    onSuccess: (file: DriveFile) => void;
    onAllSuccess: () => void;
  }) => (
    <div data-testid="upload-form">
      <button
        onClick={() => {
          const mockFile: DriveFile = {
            id: "123",
            name: "test.txt",
            mimeType: "text/plain",
            modifiedTime: new Date().toISOString(),
          };
          onSuccess(mockFile);
          onAllSuccess();
        }}
      >
        Mock Upload
      </button>
    </div>
  ),
}));

describe("UploadModal", () => {
  const mockOnUploadSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders upload button when closed", () => {
    render(<UploadModal onUploadSuccess={mockOnUploadSuccess} />);

    expect(screen.getByText("Upload Files")).toBeInTheDocument();
  });

  it("opens modal when upload button is clicked", () => {
    render(<UploadModal onUploadSuccess={mockOnUploadSuccess} />);

    fireEvent.click(screen.getByText("Upload Files"));

    expect(screen.getByText("Upload Files")).toBeInTheDocument(); // Modal title
    expect(screen.getByTestId("upload-form")).toBeInTheDocument();
  });

  it("calls onUploadSuccess and closes modal when upload is successful", () => {
    render(<UploadModal onUploadSuccess={mockOnUploadSuccess} />);

    // Open modal
    fireEvent.click(screen.getByText("Upload Files"));

    // Trigger mock upload
    fireEvent.click(screen.getByText("Mock Upload"));

    expect(mockOnUploadSuccess).toHaveBeenCalledTimes(1);
    expect(mockOnUploadSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "123",
        name: "test.txt",
      })
    );

    // Modal should be closed
    expect(screen.queryByTestId("upload-form")).not.toBeInTheDocument();
  });

  it("closes modal when close button is clicked", () => {
    render(<UploadModal onUploadSuccess={mockOnUploadSuccess} />);

    // Open modal
    fireEvent.click(screen.getByText("Upload Files"));

    // Close modal
    const closeButton = screen.getByRole("button", { name: "" }); // XMarkIcon button
    fireEvent.click(closeButton);

    // Modal should be closed
    expect(screen.queryByTestId("upload-form")).not.toBeInTheDocument();
  });
});
