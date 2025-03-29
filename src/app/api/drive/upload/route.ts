import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

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

  const results: { name: string; id?: string; error?: string }[] = [];

  for (const file of files) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const stream = Readable.from(buffer);

      const res = await drive.files.create({
        requestBody: {
          name: file.name,
        },
        media: {
          mimeType: file.type,
          body: stream,
        },
      });

      results.push({ name: file.name, id: res.data.id as string });
    } catch (err) {
      console.error("Error uploading", file.name, err);
      results.push({ name: file.name, error: "Upload failed" });
    }
  }

  return NextResponse.json({ success: true, results });
}
