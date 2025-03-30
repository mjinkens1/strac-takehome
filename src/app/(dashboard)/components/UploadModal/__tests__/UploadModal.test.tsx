import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UploadModal } from "../UploadModal";
import { DriveFile } from "../../../types";

// Mock UploadForm to isolate testing UploadModal
jest.mock("../components/UploadForm", () => ({
  UploadForm: ({
    onSuccess,
    onAllSuccess,
  }: {
    onSuccess: (file: DriveFile) => void;
    onAllSuccess: () => void;
  }) => (
    <div>
      <button onClick={() => onSuccess(mockFile)}>Trigger Success</button>
      <button onClick={onAllSuccess}>Trigger All Success</button>
    </div>
  ),
}));

const mockFile: DriveFile = {
  id: "123",
  name: "file.txt",
  mimeType: "text/plain",
  modifiedTime: "2024-01-01T00:00:00Z",
};

describe("UploadModal", () => {
  it("renders Upload Files button", () => {
    render(<UploadModal onUploadSuccess={jest.fn()} />);
    expect(screen.getAllByText(/upload files/i)[0]).toBeInTheDocument();
  });

  it("opens and closes modal", async () => {
    render(<UploadModal onUploadSuccess={jest.fn()} />);
    fireEvent.click(screen.getAllByText(/upload files/i)[0]);
    expect(
      (await screen.findAllByText(/upload files/i))[0]
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "" })); // close icon
    await waitFor(() =>
      expect(screen.queryByText("Trigger Success")).not.toBeInTheDocument()
    );
  });

  it("calls onUploadSuccess when file is uploaded", async () => {
    const mockOnSuccess = jest.fn();
    render(<UploadModal onUploadSuccess={mockOnSuccess} />);

    fireEvent.click(screen.getAllByText(/upload files/i)[0]);
    fireEvent.click(await screen.findByText("Trigger Success"));

    expect(mockOnSuccess).toHaveBeenCalledWith(mockFile);
  });

  it("closes modal on all success", async () => {
    render(<UploadModal onUploadSuccess={jest.fn()} />);

    fireEvent.click(screen.getByText(/upload files/i));
    fireEvent.click(await screen.findByText("Trigger All Success"));

    await waitFor(() =>
      expect(screen.queryByText("Trigger All Success")).not.toBeInTheDocument()
    );
  });
});
