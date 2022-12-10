import { router } from "../trpc";
import { costsRouter } from "./costs";
import { subdistrictRouter } from "./subdistricts";

export const mainRouter = router({
  subdistricts: subdistrictRouter,
  costs: costsRouter,
});
