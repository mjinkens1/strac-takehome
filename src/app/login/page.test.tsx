/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Explicitly mock both hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  ...jest.requireActual("next-auth/react"),
  useSession: jest.fn(),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders sign in button", () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "unauthenticated",
      data: null,
    });

    render(
      <SessionProvider session={null}>
        <LoginPage />
      </SessionProvider>
    );

    expect(
      screen.getByRole("button", { name: /Continue with Google/i })
    ).toBeInTheDocument();
  });

  it("redirects to dashboard if session exists", async () => {
    const replace = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({ replace });

    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: { user: { name: "Test" } },
    });

    render(
      <SessionProvider session={{ user: {}, expires: "" }}>
        <LoginPage />
      </SessionProvider>
    );

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/");
    });
  });
});
