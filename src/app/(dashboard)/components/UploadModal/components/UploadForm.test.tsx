import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UploadForm } from "./UploadForm";

describe("UploadForm", () => {
  it("should disable upload button with no file", () => {
    render(
      <UploadForm
        uploading={false}
        onSuccess={jest.fn()}
        onUploading={jest.fn()}
        onAllSuccess={jest.fn()}
      />
    );
    expect(screen.getByText("Upload Files")).toBeDisabled();
  });

  it("should enable upload after selecting file", async () => {
    render(
      <UploadForm
        uploading={false}
        onSuccess={jest.fn()}
        onUploading={jest.fn()}
        onAllSuccess={jest.fn()}
      />
    );
    const input = screen.getByTestId("file-input");

    const file = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("Upload Files")).toBeEnabled();
    });
  });
});
