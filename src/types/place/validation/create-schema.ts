import { z } from "zod";
import { PlaceDbSchemaOptional } from "./place-schema";
/////////////////////////////////////////
// ADD PLACE SCHEMA
/////////////////////////////////////////

export const AddPlaceSchema = PlaceDbSchemaOptional.merge(
	z.object({
		name: z.string().min(3),
		latitude: z.coerce.number(),
		longitude: z.coerce.number(),
		createdById: z.string().cuid(),
	})
);
export type AddPlace = z.infer<typeof AddPlaceSchema>;
