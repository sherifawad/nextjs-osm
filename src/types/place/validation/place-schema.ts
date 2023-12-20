import { z } from "zod";
/////////////////////////////////////////
// PLACE SCHEMA
/////////////////////////////////////////

export const PlaceDbSchema = z.object({
  id: z.string().cuid(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  name: z.string().min(3),
  arName: z.string().nullable(),
  enName: z.string().nullable(),
  verified: z.boolean(),
  image: z.string().nullable(),
  hidden: z.boolean(),
  deleted: z.boolean(),
  createdAt: z.coerce.date(),
  createdById: z.string().nullable(),
  modifiedAt: z.coerce.date(),
  modifiedById: z.string().nullable(),
});
export const PlaceDbSchemaOptional = z.object({
  id: z.string().cuid().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  name: z.string().min(3).optional(),
  arName: z.string().nullable().optional(),
  enName: z.string().nullable().optional(),
  verified: z.boolean().optional(),
  image: z.string().nullable().optional(),
  hidden: z.boolean().optional(),
  deleted: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  createdById: z.string().nullable().optional(),
  modifiedAt: z.coerce.date().optional(),
  modifiedById: z.string().nullable().optional(),
});

export type Place = z.infer<typeof PlaceDbSchema>;
