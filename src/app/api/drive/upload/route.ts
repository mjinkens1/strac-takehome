import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { DriveFile } from "@/app/(dashboard)/types";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll("file") as File[];

  if (!files.length) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken });
  const drive = google.drive({ version: "v3", auth });

  const results: DriveFile[] = [];

  for (const file of files) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const stream = Readable.from(buffer);

      const res = await drive.files.create({
        requestBody: {
          name: file.name,
          // optionally mimeType or parents
        },
        media: {
          mimeType: file.type,
          body: stream,
        },
        fields: "id, name, mimeType, modifiedTime",
      });
      console.log(res);
      results.push({
        name: res.data.name as string,
        id: res.data.id as string,
        mimeType: res.data.mimeType as string,
        modifiedTime: res.data.modifiedTime as string,
      });
    } catch (err) {
      console.error("Error uploading", file.name, err);
    }
  }

  return NextResponse.json({ success: true, results });
}
