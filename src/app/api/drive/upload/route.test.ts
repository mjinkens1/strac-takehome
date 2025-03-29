/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { POST as uploadRoute } from "./route";

jest.mock("next-auth");
jest.mock("googleapis");

const mockSession = { accessToken: "token" };

beforeEach(() => {
  jest.resetAllMocks();
});
describe("/api/drive/upload", () => {
  it("returns 401 if not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const req = {
      method: "POST",
      formData: async () => new FormData(),
    } as unknown as NextRequest;

    const res = await uploadRoute(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 if no file is provided", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const form = new FormData();
    const req = new NextRequest("http://localhost/api/drive/upload", {
      method: "POST",
      body: form,
    });
    const res = await uploadRoute(req);
    expect(res.status).toBe(400);
  });

  it("calls drive.files.create and returns success", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const file = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });
    const form = new FormData();
    form.append("file", file);

    const createMock = jest.fn().mockResolvedValue({ data: { id: "1" } });
    const authMock = { setCredentials: jest.fn() };

    (google.auth.OAuth2 as unknown as jest.Mock).mockImplementation(
      () => authMock
    );
    (google.drive as unknown as jest.Mock).mockReturnValue({
      files: { create: createMock },
    });

    const req = new NextRequest("http://localhost/api/drive/upload", {
      method: "POST",
      body: form,
    });

    const res = await uploadRoute(req);
    expect(res.status).toBe(200);
    expect(createMock).toHaveBeenCalled();
  });
});
