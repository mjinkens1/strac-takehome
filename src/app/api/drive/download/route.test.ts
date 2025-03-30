/**
 * @jest-environment node
 */

import { Readable } from "stream";
import { GET } from "./route"; // adjust to your actual file path
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";

jest.mock("next-auth");

const mockFilesGet = jest.fn();
const mockFilesExport = jest.fn();

jest.mock("googleapis", () => ({
  google: {
    auth: {
      OAuth2: jest.fn(() => ({
        setCredentials: jest.fn(),
      })),
    },
    drive: jest.fn(() => ({
      files: {
        get: mockFilesGet,
        export: mockFilesExport,
      },
    })),
  },
}));

function createRequest(url: string): NextRequest {
  return {
    url,
  } as unknown as NextRequest;
}

describe("GET /api/drive/download", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue({
      accessToken: "mock-access-token",
    });
  });

  it("exports Google Doc to PDF and returns buffer with headers", async () => {
    const buffer = Buffer.from("mock PDF content");

    mockFilesGet.mockResolvedValueOnce({
      data: {
        mimeType: "application/vnd.google-apps.document",
        name: "My Doc",
        size: "1234",
      },
    });

    mockFilesExport.mockResolvedValueOnce({
      data: Readable.from([buffer]),
    });

    const res = await GET(
      createRequest("http://localhost?id=123&name=custom_name")
    );

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/pdf");
    expect(res.headers.get("Content-Disposition")).toContain("custom_name.pdf");
    expect(res.headers.get("Content-Length")).toBe(buffer.length.toString());

    const actualBuffer = Buffer.from(await res.arrayBuffer());
    expect(actualBuffer.toString()).toBe(buffer.toString());
  });

  it("streams regular files directly", async () => {
    const stream = Readable.from(["Hello world!"]);
    mockFilesGet.mockResolvedValueOnce({
      data: {
        mimeType: "text/plain",
        name: "Regular_File",
        size: "12",
      },
    });

    mockFilesExport.mockResolvedValueOnce(undefined); // Not used for non-Google docs
    mockFilesGet.mockResolvedValueOnce({ data: stream }); // Directly use the mock instead

    const res = await GET(createRequest("http://localhost?id=456"));
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/plain");
    expect(res.headers.get("Content-Disposition")).toContain("Regular_File");
    expect(res.headers.get("Content-Length")).toBe("12");
  });

  it("returns 401 if not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const res = await GET(createRequest("http://localhost?id=789"));
    expect(res.status).toBe(401);
  });

  it("returns 400 if fileId is missing", async () => {
    const res = await GET(createRequest("http://localhost"));
    expect(res.status).toBe(400);
  });

  it("returns 500 on unexpected error", async () => {
    mockFilesGet.mockRejectedValueOnce(new Error("Something went wrong"));

    const res = await GET(createRequest("http://localhost?id=500"));
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toMatch(/Failed to download/);
  });
});
