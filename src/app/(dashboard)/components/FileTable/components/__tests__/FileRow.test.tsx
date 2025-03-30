import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FileRow } from "../FileRow";
import { DriveFile } from "../../../../types";

// Mock the child components and fetch
jest.mock("../FileActions", () => ({
  FileActions: ({
    onDownload,
  }: {
    onDownload: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }) => (
    <button onClick={onDownload} data-testid="download-button">
      Download
    </button>
  ),
}));

jest.mock("../../../../../components/Tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => children,
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("FileRow", () => {
  const mockFile: DriveFile = {
    id: "123",
    name: "test-file.pdf",
    mimeType: "application/pdf",
    modifiedTime: "2024-03-20T10:00:00Z",
  };

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders file information correctly", () => {
    render(<FileRow file={mockFile} onDelete={mockOnDelete} />);

    expect(screen.getByText("test-file.pdf")).toBeInTheDocument();
    expect(screen.getByText("PDF Document")).toBeInTheDocument();
    expect(screen.getByText(/3\/20\/2024/)).toBeInTheDocument();
  });

  it("handles download correctly", async () => {
    // Mock the ReadableStream
    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({
          value: new Uint8Array([1, 2, 3]),
          done: false,
        })
        .mockResolvedValueOnce({ done: true }),
    };

    const mockBody = {
      getReader: () => mockReader,
    };

    mockFetch.mockResolvedValueOnce({
      body: mockBody,
      headers: new Headers({
        "Content-Length": "3",
      }),
    });

    // Mock URL and Blob related functions
    const createObjectURLMock = jest.fn();
    const revokeObjectURLMock = jest.fn();
    window.URL.createObjectURL = createObjectURLMock;
    window.URL.revokeObjectURL = revokeObjectURLMock;

    render(<FileRow file={mockFile} onDelete={mockOnDelete} />);

    const downloadButton = screen.getByTestId("download-button");
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/drive/download?id=${mockFile.id}&name=${encodeURIComponent(
          mockFile.name
        )}`
      );
    });

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalled();
  });

  it("handles download error gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    mockFetch.mockRejectedValueOnce(new Error("Download failed"));

    render(<FileRow file={mockFile} onDelete={mockOnDelete} />);

    const downloadButton = screen.getByTestId("download-button");
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Download error",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
