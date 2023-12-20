import z from "zod";

export type SearchStatus =
  | "pending"
  | "complete"
  | "error"
  | "success"
  | undefined;

/////////////////////////////////////////
// Nominated PLACE SCHEMA
/////////////////////////////////////////

const NominatedPlaceAddressSchema = z.object({
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

export const NominatedPlaceSchema = z.object({
  address: NominatedPlaceAddressSchema.optional(),
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

// export const NominatedPlaceArraySchema = NominatedPlaceSchema.array();

export type NominatedPlace = z.infer<typeof NominatedPlaceSchema>;

/////////////////////////////////////////
// Nominated PLACE SEARCH INPUT SCHEMA
/////////////////////////////////////////

export const searchAddressesInputSchema = z.object({
  search: z.string().min(3),
});

export type SearchAddressesInput = z.infer<typeof searchAddressesInputSchema>;

/////////////////////////////////////////
// Nominated PLACE ERROR SCHEMA
/////////////////////////////////////////

export const searchAddressesErrorsSchema = z
  .object({
    serverError: z.string(),
  })
  .merge(searchAddressesInputSchema)
  .merge(NominatedPlaceSchema);

export type SearchAddressesErrorsSchemaErrors = {
  [key in keyof z.infer<typeof searchAddressesErrorsSchema>]: string;
};

/////////////////////////////////////////
// Nominated PLACE RESPONSE SCHEMA
/////////////////////////////////////////
type NominatedPlaceSuccessResponse = {
  status: "success";
  data: NominatedPlace[];
};
type NominatedPlaceErrorResponse = {
  status: "error";
  errors: Partial<SearchAddressesErrorsSchemaErrors>;
};

export type NominatedPlaceResponse =
  | NominatedPlaceSuccessResponse
  | NominatedPlaceErrorResponse;
