import { z } from "zod";

export const pUserDeleteSchema = z.object({
	id: z.string().cuid(),
});
