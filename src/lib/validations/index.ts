import z from "zod";

export const leafletMapPageSearchParameterSchema = z.object({
    lat: z.coerce.number(),
    lon: z.coerce.number(),
    search: z.string().min(3).optional(),
});

export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};




