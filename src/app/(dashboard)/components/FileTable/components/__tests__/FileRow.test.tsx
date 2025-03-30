import { render, screen, fireEvent } from "@testing-library/react";
import { MemoizedFileRow } from "../FileRow";
import { mimeTypeMap } from "../../mime-type-map";

const mockFile = {
  id: "file-123",
  name: "Test File Name",
  mimeType: "application/pdf",
  modifiedTime: new Date("2024-01-01T12:00:00Z").toISOString(),
};

describe("FileRow", () => {
  it("renders file name with tooltip", () => {
    render(
      <table>
        <tbody>
          <MemoizedFileRow file={mockFile} onDelete={jest.fn()} />
        </tbody>
      </table>
    );

    const nameEl = screen.getByText("Test File Name");
    expect(nameEl).toBeInTheDocument();
    expect(nameEl.closest("div")).toHaveClass("truncate");
  });

  it("renders correct MIME type icon and label", () => {
    render(
      <table>
        <tbody>
          <MemoizedFileRow file={mockFile} onDelete={jest.fn()} />
        </tbody>
      </table>
    );

    const label = screen.getByText(mimeTypeMap["application/pdf"].label);
    expect(label).toBeInTheDocument();
  });

  it("displays formatted modified date", () => {
    render(
      <table>
        <tbody>
          <MemoizedFileRow file={mockFile} onDelete={jest.fn()} />
        </tbody>
      </table>
    );

    const formattedDate = new Date(mockFile.modifiedTime).toLocaleString();
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
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

    const deleteBtn = screen.getByTestId("delete-button-file-123");
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith("file-123");
  });
});
