import { render, screen, fireEvent } from "@testing-library/react";
import { MemoizedFileRow } from "../FileRow";
import { mimeTypeMap } from "../../mime-type-map";
import { DriveFile } from "@/app/(dashboard)/types";

jest.mock("../FileActions", () => ({
  FileActions: ({
    file,
    onDelete,
  }: {
    file: DriveFile;
    onDelete: (fileId: string) => void;
  }) => (
    <button
      data-testid={`delete-button-${file.id}`}
      onClick={() => onDelete(file.id)}
    >
      Mock Delete
    </button>
  ),
}));

jest.mock("../../../../../components/Tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockFile = {
  id: "abc123",
  name: "Sample Report",
  mimeType: "application/pdf",
  modifiedTime: "2024-12-01T18:30:00.000Z",
};

describe("FileRow", () => {
  it("renders file name with tooltip wrapper", () => {
    render(
      <table>
        <tbody>
          <MemoizedFileRow file={mockFile} onDelete={jest.fn()} />
        </tbody>
      </table>
    );

    expect(screen.getByText("Sample Report")).toBeInTheDocument();
  });

  it("displays correct MIME icon and label", () => {
    render(
      <table>
        <tbody>
          <MemoizedFileRow file={mockFile} onDelete={jest.fn()} />
        </tbody>
      </table>
    );

    const label = mimeTypeMap[mockFile.mimeType]?.label;
    if (label) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("formats and displays the modified date", () => {
    const expected = new Date(mockFile.modifiedTime).toLocaleString();

    render(
      <table>
        <tbody>
          <MemoizedFileRow file={mockFile} onDelete={jest.fn()} />
        </tbody>
      </table>
    );

    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = jest.fn();

    render(
      <table>
        <tbody>
          <MemoizedFileRow file={mockFile} onDelete={onDelete} />
        </tbody>
      </table>
    );

    const deleteBtn = screen.getByTestId("delete-button-abc123");
    fireEvent.click(deleteBtn);

    expect(onDelete).toHaveBeenCalledWith("abc123");
  });
});
