import { pinata } from "@/lib/pinata";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const response = await pinata.upload.public.file(file);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to upload file: ${error}` },
      { status: 400 }
    );
  }
}
