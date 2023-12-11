import { z } from "zod";

export const sortingSchema = z.enum(["asc", "desc"]);
