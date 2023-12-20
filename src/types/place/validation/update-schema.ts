import { z } from "zod";
import { PlaceDbSchemaOptional } from "./place-schema";
/////////////////////////////////////////
// EDIT PLACE SCHEMA
/////////////////////////////////////////

export const EditPlaceSchema = PlaceDbSchemaOptional.merge(
  z.object({
    id: z.string().cuid(),
    modifiedById: z.string().cuid(),
  }),
);
export type EditPlace = z.infer<typeof EditPlaceSchema>;
