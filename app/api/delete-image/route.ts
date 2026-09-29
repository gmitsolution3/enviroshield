import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { public_id } = await req.json();

    if (!public_id) {
      return NextResponse.json(
        { error: "public_id required" },
        { status: 400 },
      );
    }

    const result = await cloudinary.uploader.destroy(public_id);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 },
    );
  }
}