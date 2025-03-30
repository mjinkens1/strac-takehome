import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken });

  const drive = google.drive({ version: "v3", auth });

  const { searchParams } = new URL(request.url);
  const pageToken = searchParams.get("pageToken");

  try {
    const { data } = await drive.files.list({
      pageSize: 20,
      q: "trashed = false and mimeType != 'application/octet-stream' and mimeType != 'application/vnd.google-apps.folder'",
      orderBy: "modifiedTime desc",
      spaces: "drive",
      fields: "nextPageToken, files(id, name, mimeType, modifiedTime)",
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      pageToken: pageToken?.length ? pageToken : undefined,
    });

    return NextResponse.json({
      files: data.files ?? [],
      nextPageToken: data.nextPageToken ?? undefined,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}
