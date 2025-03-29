/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { DELETE as deleteRoute } from "./route";

jest.mock("next-auth");
jest.mock("googleapis");

const mockSession = { accessToken: "token" };

beforeEach(() => {
  jest.resetAllMocks();
});

describe("/api/drive/delete", () => {
  it("returns 401 if not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/drive/delete?id=1");
    const res = await deleteRoute(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 if no ID provided", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const req = new NextRequest("http://localhost/api/drive/delete");
    const res = await deleteRoute(req);
    expect(res.status).toBe(400);
  });

  it("calls delete and returns success", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const deleteMock = jest.fn().mockResolvedValue({});
    const authMock = { setCredentials: jest.fn() };
    (google.auth.OAuth2 as unknown as jest.Mock).mockImplementation(
      () => authMock
    );
    (google.drive as unknown as jest.Mock).mockReturnValue({
      files: { delete: deleteMock },
    });

    const req = new NextRequest("http://localhost/api/drive/delete?id=123");
    const res = await deleteRoute(req);
    expect(res.status).toBe(200);
    expect(deleteMock).toHaveBeenCalledWith({ fileId: "123" });
  });
});
