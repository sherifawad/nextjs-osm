import z from "zod";

export const leafletMapPageSearchParameterSchema = z.object({
    lat: z.coerce.number(),
    lon: z.coerce.number(),
    search: z.string().min(3).optional(),
});

export const addPlaceSchema = z.object({
    name: z.string().trim().min(1, { message: "name is required" }),
});
