import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users, roles, userRoles } from "@/lib/db/schemas";
import { eq } from "drizzle-orm";
import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

const withTimeout = <T>(p: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("DB query timed out")), ms)),
  ]);

function getSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.AUTH_SECRET || "");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  jwt: {
    encode: async ({ token }) => {
      return new SignJWT(token as Record<string, unknown>)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(getSecret());
    },
    decode: async ({ token }) => {
      if (!token) return null;
      try {
        const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
        return payload;
      } catch {
        return null;
      }
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const user = await withTimeout(
            db.query.users.findFirst({ where: eq(users.email, credentials.email as string) }),
            10000,
          );
          if (!user || !user.passwordHash) return null;
          const bcrypt = await import("bcryptjs");
          const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash);
          if (!isValid) return null;
          return { id: user.id, email: user.email, name: `${user.firstName} ${user.lastName}`, image: user.avatarUrl, role: "authenticated" };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if ((trigger === "signIn" || trigger === "signUp") && user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        try {
          const [userRecord] = await withTimeout(
            db
              .select({ roleName: roles.name, schoolId: users.schoolId })
              .from(userRoles)
              .innerJoin(roles, eq(userRoles.roleId, roles.id))
              .innerJoin(users, eq(userRoles.userId, users.id))
              .where(eq(userRoles.userId, token.id as string))
              .limit(1),
            10000,
          );
          session.user.role = userRecord?.roleName || "student";
          (session.user as any).schoolId = userRecord?.schoolId || null;
        } catch {
          session.user.role = "student";
          (session.user as any).schoolId = null;
        }
      }
      return session;
    },
  },
});