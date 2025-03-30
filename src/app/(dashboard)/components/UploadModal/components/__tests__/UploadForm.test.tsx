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
    (useDropzone as jest.Mock).mockReturnValue({
      getRootProps: () => ({}),
      getInputProps: () => ({}),
      isDragActive: false,
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            results: [
              {
                id: "1",
                name: "example.txt",
                mimeType: "text/plain",
                modifiedTime: "2025-03-30T00:00:00Z",
              },
            ],
          }),
      })
    ) as jest.Mock;
  });

  it("renders upload dropzone and button", () => {
    render(
      <UploadForm
        uploading={false}
        onSuccess={mockOnSuccess}
        onUploading={mockOnUploading}
        onAllSuccess={mockOnAllSuccess}
      />
    );

    expect(screen.getByText(/drag & drop files here/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /upload/i })).toBeDisabled();
  });

  it("handles successful upload flow", async () => {
    render(
      <UploadForm
        uploading={false}
        onSuccess={mockOnSuccess}
        onUploading={mockOnUploading}
        onAllSuccess={mockOnAllSuccess}
      />
    );

    const file = new File(["file content"], "example.txt", {
      type: "text/plain",
    });
    const onDrop = (useDropzone as jest.Mock).mock.calls[0][0].onDrop;

    await act(async () => {
      onDrop([file]);
    });

    const button = screen.getByRole("button", { name: /upload/i });

    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(mockOnUploading).toHaveBeenCalledWith(true);
      expect(mockOnSuccess).toHaveBeenCalledWith({
        id: "1",
        name: "example.txt",
        mimeType: "text/plain",
        modifiedTime: "2025-03-30T00:00:00Z",
      });
      expect(mockOnAllSuccess).toHaveBeenCalled();
    });
  });
});
