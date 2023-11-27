import { z } from "zod";
import { REPUTATIONSchema } from "@/database";

export const updateRateSchema = z.object({
	placeId: z.string().cuid(),
	placeRate: REPUTATIONSchema,
});
export type UpdateRateSchema = z.infer<typeof updateRateSchema>;
