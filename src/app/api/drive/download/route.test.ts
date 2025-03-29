/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { GET as downloadRoute } from "./route";

jest.mock("next-auth");
jest.mock("googleapis");

const mockSession = { accessToken: "token" };

beforeEach(() => {
  jest.resetAllMocks();
});

describe("/api/drive/download", () => {
  it("returns 401 if not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/drive/download?id=1");
    const res = await downloadRoute(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 if no ID provided", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const req = new NextRequest("http://localhost/api/drive/download");
    const res = await downloadRoute(req);
    expect(res.status).toBe(400);
  });

  it("streams file if authenticated and valid ID", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const streamMock = {};
    const getMock = jest.fn().mockResolvedValue({ data: streamMock });
    const authMock = { setCredentials: jest.fn() };
    (google.auth.OAuth2 as unknown as jest.Mock).mockImplementation(
      () => authMock
    );
    (google.drive as unknown as jest.Mock).mockReturnValue({
      files: { get: getMock },
    });

    const req = new NextRequest(
      "http://localhost/api/drive/download?id=123&name=test.pdf"
    );
    const res = await downloadRoute(req);
    expect(res.status).toBe(200);
  });
});
