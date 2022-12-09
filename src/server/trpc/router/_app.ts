import { router } from "../trpc";
import { authRouter } from "./auth";
import { mainRouter } from ".";

export const appRouter = router({
  queries: mainRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
