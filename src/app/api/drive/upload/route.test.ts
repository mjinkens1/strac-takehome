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

  it("uploads multiple files and returns success", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const file1 = new File(["file1 content"], "file1.pdf", {
      type: "application/pdf",
    });
    const file2 = new File(["file2 content"], "file2.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const form = new FormData();
    form.append("file", file1);
    form.append("file", file2);

    const createMock = jest
      .fn()
      .mockResolvedValueOnce({ data: { id: "1" } })
      .mockResolvedValueOnce({ data: { id: "2" } });

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
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(createMock).toHaveBeenCalledTimes(2);
    expect(data.success).toBe(true);
    expect(data.results).toHaveLength(2);
  });
});
