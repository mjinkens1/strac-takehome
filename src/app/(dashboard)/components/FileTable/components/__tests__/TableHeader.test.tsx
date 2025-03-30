import { render, screen } from "@testing-library/react";
import { TableHeader } from "../TableHeader";

describe("TableHeader", () => {
  it("renders all column headers", () => {
    render(<TableHeader />);

    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(4);

    expect(headers[0]).toHaveTextContent("Filename");
    expect(headers[1]).toHaveTextContent("Type");
    expect(headers[2]).toHaveTextContent("Modified");
    expect(headers[3]).toHaveTextContent("Actions");
  });

  it("has correct styling classes", () => {
    render(<TableHeader />);

    const thead = screen.getByRole("rowgroup");
    expect(thead).toHaveClass(
      "sticky",
      "top-0",
      "z-10",
      "border-b",
      "border-[var(--color-card-border)]",
      "bg-[var(--color-card-bg)]"
    );
  });

  it("has correct width classes for columns", () => {
    render(<TableHeader />);

    const headers = screen.getAllByRole("columnheader");
    expect(headers[0]).toHaveClass("w-[40%]");
    expect(headers[1]).toHaveClass("w-[25%]");
    expect(headers[2]).toHaveClass("w-[25%]");
    expect(headers[3]).toHaveClass("w-[10%]");
  });

  it("matches snapshot", () => {
    const { container } = render(<TableHeader />);
    expect(container).toMatchSnapshot();
  });
});
