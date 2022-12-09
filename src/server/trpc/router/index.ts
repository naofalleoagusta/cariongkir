import { router } from "../trpc";
import { subdistrictRouter } from "./subdistricts";

export const mainRouter = router({
  subdistricts: subdistrictRouter,
});
