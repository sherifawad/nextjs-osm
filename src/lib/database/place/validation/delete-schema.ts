import { z } from "zod";

export const placeDeleteSchema = z.object({
	placeId: z.string().cuid(),
});
