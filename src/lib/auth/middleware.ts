import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function base64UrlToString(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  return atob(base64);
}

function base64UrlToBytes(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function textToBytes(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

async function importKey(secret: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    secret as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
}

export async function getSessionFromCookie(request: NextRequest): Promise<{
  user: { id: string; role: string; schoolId?: string | null } | null;
}> {
  const cookieName = "next-auth.session-token";
  const cookie = request.cookies.get(cookieName);
  if (!cookie?.value) return { user: null };

  const token = cookie.value;
  const parts = token.split(".");
  if (parts.length !== 3) return { user: null };

  try {
    const secret = process.env.AUTH_SECRET;
    if (!secret) return { user: null };

    const key = await importKey(textToBytes(secret));
    const signature = base64UrlToBytes(parts[2]);
    const data = textToBytes(`${parts[0]}.${parts[1]}`);

    const valid = await crypto.subtle.verify("HMAC", key, signature as BufferSource, data as BufferSource);
    if (!valid) return { user: null };

    const payload = JSON.parse(base64UrlToString(parts[1]));
    if (!payload || !payload.id) return { user: null };

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return { user: null };

    return {
      user: {
        id: payload.id as string,
        role: (payload.role as string) || "student",
        schoolId: payload.schoolId as string | null | undefined,
      },
    };
  } catch {
    return { user: null };
  }
}