import { z } from "zod";
import { EditPlaceSchema, PlaceDataErrorsSchema } from "../validations/place-schema";
import { Place } from "@/schema/index";

export type EditPlaceForm = z.infer<typeof EditPlaceSchema>;
export type PlaceFormDataErrors = z.infer<typeof PlaceDataErrorsSchema>;

export type EditPlaceFieldValues = Omit<Place, "createdById" | "modifiedById" | "createdAt" | "modifiedAt">;

export type EditPlaceFormState = {
	message: string;
	errors: Partial<Record<keyof Partial<EditPlaceForm>, string[] | undefined>> | undefined;
	fieldValues: EditPlaceFieldValues;
};

export type EditPlaceFormDataErrors = {
	[key in keyof PlaceFormDataErrors]: string;
};

export type updateMosqueLocationSuccessStatus = {
	status: "Success";
	data: Place;
};
export type updateMosqueLocationErrorStatus = {
	status: "Error";
	errors: Partial<EditPlaceFormDataErrors>;
};

export type updateMosqueLocationResult = updateMosqueLocationSuccessStatus | updateMosqueLocationErrorStatus;
// export type updateMosqueLocationReturnType = {
// 	success: boolean;
// 	errors: Partial<EditPlaceFormDataErrors> | null;
// 	data: Place | null;
// };
