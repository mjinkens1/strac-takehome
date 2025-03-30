import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DashboardPage from "./page";
import { SessionProvider } from "next-auth/react";
import { ToastManager } from "../components/Toast";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock the global fetch function
global.fetch = jest.fn((url) => {
  if (typeof url === "string" && url.startsWith("/api/drive/delete")) {
    return Promise.resolve({ ok: true });
  }

  return Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          id: "1",
          name: "Test.pdf",
          mimeType: "application/pdf",
          modifiedTime: new Date().toISOString(),
        },
      ]),
  });
}) as jest.Mock;

describe("DashboardPage integration", () => {
  it("shows uploaded file list and handles deletion", async () => {
    render(
      <SessionProvider session={{ expires: "", user: {} }}>
        <ToastManager>
          <DashboardPage />
        </ToastManager>
      </SessionProvider>
    );

    // Verify file appears
    await waitFor(() => {
      expect(screen.getByText(/Test.pdf/)).toBeInTheDocument();
    });

    // Click delete button
    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/^\/api\/drive\/delete\?id=1/),
        expect.objectContaining({ method: "DELETE" })
      );
    });
  });
});
