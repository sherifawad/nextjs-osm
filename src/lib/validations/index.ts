import z from "zod";
import { PlaceUpdateInputSchema } from "./generated-zod-schemas";

export const leafletMapPageSearchParameterSchema = z.object({
    lat: z.coerce.number(),
    lon: z.coerce.number(),
    search: z.string().min(3).optional(),
});

export const addPlaceSchema = z.object({
    name: z.string().trim().min(1, { message: "name is required" }),
});
export const EditPlaceSchema = PlaceUpdateInputSchema.and(
    z.object({
        id: z.string().cuid(),
        name: z.string().min(3),
        latitude: z.coerce.number(),
        longitude: z.coerce.number(),
    })
);

export type EditPlaceFormDataErrors = { serverError?: string } & {
    [key in keyof z.infer<typeof PlaceUpdateInputSchema>]: string;
};
