import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const MAX_OFFSET = 1_000_000;
const MAX_SEARCH_LENGTH = 100;

function parseIntegerParameter(
  value: string | null,
  fallback: number,
  minimum: number,
  maximum: number,
) {
  if (value === null) return fallback;
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum) {
    return null;
  }
  return parsed;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function serializeDate(value: unknown): string | null {
  const date =
    value instanceof Date
      ? value
      : typeof value === "string"
        ? new Date(value)
        : null;
  return date && Number.isFinite(date.getTime()) ? date.toISOString() : null;
}

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json(
        { message: "Authentication is required." },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }

    // Ask Better Auth's configured admin access control for the same permission
    // its built-in user-list endpoint requires, including configured admin IDs.
    const permission = await auth.api.userHasPermission({
      headers: request.headers,
      body: { permissions: { user: ["list"] } },
    });
    if (!permission.success) {
      return NextResponse.json(
        { message: "You do not have permission to view users." },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }

    const params = new URL(request.url).searchParams;
    const limit = parseIntegerParameter(
      params.get("limit"),
      DEFAULT_LIMIT,
      1,
      MAX_LIMIT,
    );
    const offset = parseIntegerParameter(
      params.get("offset"),
      0,
      0,
      MAX_OFFSET,
    );
    const search = (params.get("search") ?? "").trim();
    if (limit === null || offset === null || search.length > MAX_SEARCH_LENGTH) {
      return NextResponse.json(
        { message: "Invalid search or pagination parameters." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const filter = search
      ? { name: { $regex: escapeRegex(search), $options: "i" } }
      : {};

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    // Better Auth's Mongo adapter uses the model name as the collection name.
    // The auth config does not override the default "user" model name.
    const usersCollection = db.collection("user");
    const [documents, total] = await Promise.all([
      usersCollection
        .find(filter, {
          projection: {
            name: 1,
            email: 1,
            image: 1,
            createdAt: 1,
            role: 1,
            banned: 1,
          },
        })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .toArray(),
      usersCollection.countDocuments(filter),
    ]);

    const results = documents.flatMap((document) => {
      const createdAt = serializeDate(document.createdAt);
      if (!createdAt) return [];
      return [{
        id: String(document._id),
        name: typeof document.name === "string" ? document.name : "",
        email: typeof document.email === "string" ? document.email : "",
        image: typeof document.image === "string" ? document.image : null,
        createdAt,
        role: typeof document.role === "string" ? document.role : "user",
        banned: Boolean(document.banned),
      }];
    });

    return NextResponse.json(
      { users: results, total },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to search users right now." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
