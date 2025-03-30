import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

// Map of exportable Google MIME types to downloadable formats
const EXPORT_MIME_TYPES: Record<string, string> = {
  "application/vnd.google-apps.document": "application/pdf",
  "application/vnd.google-apps.spreadsheet":
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.google-apps.presentation":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

const EXTENSION_MAP: Record<string, string> = {
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "application/pdf": ".pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    ".pptx",
};

// Sanitizes filenames by replacing unsafe characters with underscores
function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_\.]/g, "_");
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("id");
  const userFileName = searchParams.get("name");

  if (!fileId) {
    return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken });
  const drive = google.drive({ version: "v3", auth });

  try {
    // Fetch file metadata to determine file type and size
    const fileMeta = await drive.files.get({
      fileId,
      fields: "mimeType, name, size",
    });

    const mimeType = fileMeta.data.mimeType;
    const size = fileMeta.data.size
      ? parseInt(fileMeta.data.size, 10)
      : undefined;

    // Handle Google Workspace files that need to be exported
    // (Docs -> PDF, Sheets -> XLSX, etc.)
    const exportMimeType = mimeType && EXPORT_MIME_TYPES[mimeType];
    const extension = exportMimeType ? EXTENSION_MAP[exportMimeType] || "" : "";
    const baseFileName = userFileName || fileMeta.data.name || "file";
    const fileName = sanitizeFilename(baseFileName) + extension;

    if (exportMimeType) {
      // For Google Workspace files: Export and convert to downloadable format
      const result = await drive.files.export(
        { fileId, mimeType: exportMimeType },
        { responseType: "stream" }
      );

      // Convert stream to buffer to ensure complete file download and matching Content Length,
      // which is required for the download to work in the browser for most Google files.
      const chunks: Uint8Array[] = [];
      for await (const chunk of result.data as Readable) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
      }
      const buffer = Buffer.concat(chunks);

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": exportMimeType,
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Content-Length": buffer.length.toString(),
        },
      });
    }

    // For regular files: Stream directly from Google Drive
    const result = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    const stream = result.data as Readable;

    return new NextResponse(stream as unknown as BodyInit, {
      headers: {
        "Content-Type": mimeType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${sanitizeFilename(
          baseFileName
        )}"`,
        ...(size ? { "Content-Length": size.toString() } : {}),
      },
    });
  } catch (err) {
    console.error("Download failed", err);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}
