import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { auth } from "@/lib/auth";
import { getRequestSession } from "@/lib/auth-guards";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_REQUEST_SIZE = MAX_FILE_SIZE + 64 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function getProfileFolder(userId: string) {
  const root = process.env.CLOUDINARY_FOLDER_NAME?.replace(/^\/+|\/+$/g, "");
  return [root, "profiles", userId].filter(Boolean).join("/");
}

async function isSupportedImage(file: File) {
  if (!IMAGE_TYPES.has(file.type) || file.size > MAX_FILE_SIZE || file.size === 0) {
    return false;
  }

  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng =
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e &&
    bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a &&
    bytes[6] === 0x1a && bytes[7] === 0x0a;
  const isWebp =
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";

  return isJpeg || isPng || isWebp;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) {
        return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_SIZE) {
    return NextResponse.json({ error: "The image must be 5 MB or smaller." }, { status: 413 });
  }

  const session = await getRequestSession(request);
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Select an image to upload." }, { status: 400 });
    }
    if (!(await isSupportedImage(file))) {
      return NextResponse.json(
        { error: "Choose a JPG, PNG, or WebP image no larger than 5 MB." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: getProfileFolder(session.user.id),
              resource_type: "image",
              allowed_formats: ["jpg", "png", "webp"],
            },
            (error, uploaded) => {
              if (error) reject(error);
              else if (!uploaded?.secure_url || !uploaded.public_id) {
                reject(new Error("Upload response was incomplete."));
              } else resolve(uploaded);
            },
          )
          .end(buffer);
      },
    );

    try {
      const saved = await auth.api.updateUser({
        headers: request.headers,
        body: {
          image: uploaded.secure_url,
          imagePublicId: uploaded.public_id,
        },
        returnHeaders: true,
      });

      const ownImagePrefix = `${getProfileFolder(session.user.id)}/`;
      const previousPublicId = session.user.imagePublicId;
      if (previousPublicId?.startsWith(ownImagePrefix)) {
        void cloudinary.uploader
          .destroy(previousPublicId, { resource_type: "image" })
          .catch(() => undefined);
      }

      return NextResponse.json(
        { url: uploaded.secure_url, publicId: uploaded.public_id },
        { headers: saved.headers },
      );
    } catch {
      await cloudinary.uploader
        .destroy(uploaded.public_id, { resource_type: "image" })
        .catch(() => undefined);
      return NextResponse.json(
        { error: "Unable to save your profile photo. Your current photo was not changed." },
        { status: 500 },
      );
    }
  } catch {
    return NextResponse.json({ error: "Unable to upload this image. Please try again." }, { status: 500 });
  }
}
