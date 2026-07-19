import { router } from "./server";
import { publicRouter } from "./routers/public";
import { studentRouter } from "./routers/student";
import { teacherRouter } from "./routers/teacher";
import { parentRouter } from "./routers/parent";
import { schoolRouter } from "./routers/school";
import { assessmentRouter } from "./routers/assessment";
import { adminRouter } from "./routers/admin";

export const appRouter = router({
  public: publicRouter,
  student: studentRouter,
  teacher: teacherRouter,
  parent: parentRouter,
  school: schoolRouter,
  assessment: assessmentRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
