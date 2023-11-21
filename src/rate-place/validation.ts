import { REPUTATIONSchema } from "@/database/place/validation";
import { z } from "zod";

export const updateRateSchema = z.object({
	placeId: z.string().cuid(),
	placeRate: REPUTATIONSchema,
});
