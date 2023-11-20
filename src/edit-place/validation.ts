import { z } from "zod";

export const editPlaceFormSchema = z.object({
	id: z.string().cuid(),
	latitude: z.coerce.number().optional(),
	longitude: z.coerce.number().optional(),
	name: z.string().min(3).optional(),
	arName: z.string().min(3).nullable().optional(),
	enName: z.string().min(3).nullable().optional(),
	verified: z.boolean().optional(),
	image: z.string().nullable().optional(),
	hidden: z.boolean().optional(),
	deleted: z.boolean().optional(),
});

export type TEditPlaceForm = z.infer<typeof editPlaceFormSchema>;

export const roleSchema = z.enum(["USER", "ADMIN", "OWNER"]);

export type RoleType = `${z.infer<typeof roleSchema>}`;
