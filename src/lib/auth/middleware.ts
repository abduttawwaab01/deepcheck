import type { NextRequest } from "next/server";

function base64UrlToString(str: string): string {
  return atob(str.replace(/-/g, "+").replace(/_/g, "/"));
}

function base64UrlToBytes(str: string): Uint8Array {
  const binary = atob(str.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function getSessionFromCookie(request: NextRequest): Promise<{
  user: { id: string; role: string; schoolId?: string | null } | null;
}> {
  const cookieNames = ["__Secure-authjs.session-token", "authjs.session-token"];
  let token: string | undefined;
  for (const name of cookieNames) {
    const c = request.cookies.get(name);
    if (c?.value) { token = c.value; break; }
  }
  if (!token) return { user: null };

  const parts = token.split(".");
  if (parts.length !== 3) return { user: null };

  try {
    const secret = process.env.AUTH_SECRET;
    if (!secret) return { user: null };

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret) as BufferSource,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToBytes(parts[2]) as BufferSource,
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`) as BufferSource,
    );
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