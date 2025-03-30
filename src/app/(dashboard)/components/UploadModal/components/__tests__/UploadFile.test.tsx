import { render, screen, fireEvent } from "@testing-library/react";
import { UploadFile } from "../UploadFile";

describe("UploadFile", () => {
  const mockFile = { name: "example.txt" };
  const mockOnRemove = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders file name", () => {
    render(
      <UploadFile
        file={mockFile}
        isCompleted={false}
        isUploading={false}
        onRemoveFile={mockOnRemove}
      />
    );

    expect(screen.getByText("example.txt")).toBeInTheDocument();
  });

  it("renders spinner when uploading", () => {
    render(
      <UploadFile
        file={mockFile}
        isCompleted={false}
        isUploading={true}
        onRemoveFile={mockOnRemove}
      />
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders checkmark when upload is complete", () => {
    render(
      <UploadFile
        file={mockFile}
        isCompleted={true}
        isUploading={false}
        onRemoveFile={mockOnRemove}
      />
    );

    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
  });

  it("calls onRemoveFile when X is clicked", () => {
    render(
      <UploadFile
        file={mockFile}
        isCompleted={false}
        isUploading={false}
        onRemoveFile={mockOnRemove}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockOnRemove).toHaveBeenCalledWith(mockFile);
  });
});
