import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { SessionUser } from "@/types";

export interface TRPCContext {
  user: SessionUser | null;
  db: typeof db;
  req: Headers;
}

export const createTRPCContext = async (opts: { headers: Headers }): Promise<TRPCContext> => {
  const session = await auth();
  const user = session?.user ? session.user as unknown as SessionUser : null;
  return { user, db, req: opts.headers };
};

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { ...ctx, user: ctx.user! } });
});

export const protectedProcedure = t.procedure.use(isAuthenticated);

export const requireRole = (...roles: string[]) =>
  t.middleware(({ ctx, next }) => {
    if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
    if (!roles.includes(ctx.user.role)) throw new TRPCError({ code: "FORBIDDEN" });
    return next({ ctx: { ...ctx, user: ctx.user! } });
  });

export const adminProcedure = t.procedure.use(requireRole("admin"));
export const schoolProcedure = t.procedure.use(requireRole("admin", "school_admin"));
export const studentProcedure = t.procedure.use(requireRole("student", "admin"));
export const teacherProcedure = t.procedure.use(requireRole("teacher", "admin"));
export const parentProcedure = t.procedure.use(requireRole("parent", "admin"));
