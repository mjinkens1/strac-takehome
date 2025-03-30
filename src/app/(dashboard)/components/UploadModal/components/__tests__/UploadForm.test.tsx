import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { UploadForm } from "../UploadForm";
import { useDropzone } from "react-dropzone";

// Mock react-dropzone
jest.mock("react-dropzone", () => ({
  useDropzone: jest.fn(),
}));

describe("UploadForm", () => {
  const mockOnSuccess = jest.fn();
  const mockOnUploading = jest.fn();
  const mockOnAllSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default useDropzone mock implementation
    (useDropzone as jest.Mock).mockReturnValue({
      getRootProps: () => ({}),
      getInputProps: () => ({}),
      isDragActive: false,
    });
  });

  it("renders upload area when not uploading", () => {
    render(
      <UploadForm
        uploading={false}
        onSuccess={mockOnSuccess}
        onUploading={mockOnUploading}
        onAllSuccess={mockOnAllSuccess}
      />
    );

    expect(screen.getByTestId("file-input")).toBeInTheDocument();
    expect(screen.getByText(/drag & drop files here/i)).toBeInTheDocument();
  });

  it("shows upload button as disabled when no files are selected", () => {
    render(
      <UploadForm
        uploading={false}
        onSuccess={mockOnSuccess}
        onUploading={mockOnUploading}
        onAllSuccess={mockOnAllSuccess}
      />
    );

    const uploadButton = screen.getByRole("button", { name: /upload/i });
    expect(uploadButton).toBeDisabled();
  });

  it("handles file upload success", async () => {
    // Mock XMLHttpRequest
    const xhrMock = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      readyState: 4,
      status: 200,
      responseText: JSON.stringify({
        results: [
          {
            id: "123",
            name: "test.txt",
            mimeType: "text/plain",
            modifiedTime: "2024-01-01",
          },
        ],
      }),
      onload: null as unknown as (() => void) | null,
    };

    // Create a constructor that sets up the mock
    const MockXHR = function (this: typeof xhrMock) {
      Object.assign(this, xhrMock);
      // Trigger onload when send is called
      this.send = jest.fn(() => {
        setTimeout(() => {
          this.onload?.();
        }, 0);
      });
    };

    global.XMLHttpRequest = jest.fn(
      () => new (MockXHR as unknown as new () => XMLHttpRequest)()
    ) as unknown as typeof XMLHttpRequest;

    render(
      <UploadForm
        uploading={false}
        onSuccess={mockOnSuccess}
        onUploading={mockOnUploading}
        onAllSuccess={mockOnAllSuccess}
      />
    );

    // Simulate file drop
    const file = new File(["test"], "test.txt", { type: "text/plain" });
    const onDrop = (useDropzone as jest.Mock).mock.calls[0][0].onDrop;

    await act(async () => {
      onDrop([file]);
    });

    // Trigger upload
    const uploadButton = screen.getByRole("button", { name: /upload/i });
    await act(async () => {
      fireEvent.click(uploadButton);
    });

    // Wait for success callback
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith({
        id: "123",
        name: "test.txt",
        mimeType: "text/plain",
        modifiedTime: "2024-01-01",
      });
    });
  });
});
