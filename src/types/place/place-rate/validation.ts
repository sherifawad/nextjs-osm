import { z } from "zod";

export const sortingSchema = z.enum(["asc", "desc"]);

export type SortingType = z.infer<typeof sortingSchema>;
/////////////////////////////////////////
// PLACE RATING SCHEMA
/////////////////////////////////////////
export const REPUTATIONSchema = z.enum(["FAKE", "VERIFIED"]);

export type REPUTATIONType = `${z.infer<typeof REPUTATIONSchema>}`;

export const PlaceRatingSchema = z.object({
	placeReputation: REPUTATIONSchema,
	placeId: z.string(),
	userId: z.string(),
});

/////////////////////////////////////////
// READ RATINGS SCHEMA
/////////////////////////////////////////

export const DataBaseRatingSchema = z.object({
	_count: z.object({
		rating: z.number().int(),
	}),
	rating: PlaceRatingSchema.omit({ placeId: true }).array(),
});
export type PlaceRating = z.infer<typeof PlaceRatingSchema>;

/////////////////////////////////////////
// EDIT PLACE RATE SCHEMA
/////////////////////////////////////////

export const EditPlaceRateSchema = z.object({
	userId: z.string().cuid(),
	placeId: z.string().cuid(),
	placeRate: REPUTATIONSchema,
});
export type EditPlaceRate = z.infer<typeof EditPlaceRateSchema>;

/////////////////////////////////////////
// RATING SCHEMA ERROR
/////////////////////////////////////////

export const placeRateErrorsSchema = PlaceRatingSchema.merge(
	z.object({
		serverError: z.string(),
	})
);

export type PlaceRateErrors = {
	[key in keyof z.infer<typeof placeRateErrorsSchema>]: string;
};

/////////////////////////////////////////
// RATING SCHEMA response
/////////////////////////////////////////

export type placeRateUpdatedData = {
	state: REPUTATIONType | undefined;
	count: number;
};

type RateSuccessResponse = { status: "success"; data: placeRateUpdatedData };
export type RateErrorResponse = { status: "error"; errors: Partial<PlaceRateErrors> };

export type placeRateUpdateResponse = RateSuccessResponse | RateErrorResponse;
