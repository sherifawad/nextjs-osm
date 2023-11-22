import { z } from "zod";

/////////////////////////////////////////
// USER ROLE SCHEMA
/////////////////////////////////////////
export const RoleSchema = z.enum(["USER", "ADMIN", "OWNER"]);

export type RoleType = `${z.infer<typeof RoleSchema>}`;

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserDbSchema = z.object({
	role: RoleSchema,
	id: z.string().cuid(),
	name: z.string().nullable(),
	email: z.string().nullable(),
	emailVerified: z.coerce.date().nullable(),
	image: z.string().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	userReputation: z.number().int(),
});

export type User = z.infer<typeof UserDbSchema>;

/////////////////////////////////////////
// USER OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const UserDbOptionalSchema = UserDbSchema.merge(
	z.object({
		role: RoleSchema.optional(),
		id: z.string().cuid().optional(),
		name: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		emailVerified: z.coerce.date().nullable().optional(),
		image: z.string().nullable().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		userReputation: z.number().int().optional(),
	})
);

export type UserDbOptional = z.infer<typeof UserDbOptionalSchema>;
