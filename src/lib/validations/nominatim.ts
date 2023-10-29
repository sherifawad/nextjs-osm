import z from "zod";

export const ominatimAddressSchema = z.object({
    "ISO3166-2-lvl4": z.coerce.string().optional(),
    city: z.coerce.string().optional(),
    country: z.coerce.string().optional(),
    country_code: z.coerce.string().optional(),
    region: z.coerce.string().optional(),
    state: z.coerce.string().optional(),
    village: z.coerce.string().optional(),
    building: z.coerce.string().optional(),
    house_number: z.coerce.number().optional(),
    road: z.coerce.string().optional(),
    suburb: z.coerce.string().optional(),
    municipality: z.coerce.string().optional(),
    county: z.coerce.string().optional(),
    postcode: z.coerce.number().optional(),
});

export const ominatimSchema = z.object({
    address: ominatimAddressSchema,
    addresstype: z.coerce.string().optional(),
    boundingbox: z.array(z.string()).length(4).optional(),
    class: z.coerce.string().optional(),
    display_name: z.coerce.string().optional(),
    importance: z.coerce.number().optional(),
    lat: z.coerce.number(),
    licence: z.coerce.string().optional(),
    lon: z.coerce.number(),
    name: z.coerce.string().optional(),
    osm_type: z.coerce.string().optional(),
    type: z.coerce.string().optional(),
    osm_id: z.coerce.number().optional(),
    place_id: z.coerce.number().optional(),
    place_rank: z.coerce.number().optional(),
});

export const ominatimArraySchema = ominatimSchema.array();
