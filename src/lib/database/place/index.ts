import { ErrorResponse, PlaceDataErrors } from "@/lib/validations/place-schema";
import { ZodType, ZodTypeAny } from "zod";
import { PlaceRateErrors } from "../prisma/place/update";

export * from "./create";

export const validatePlaceInputs = <T>({ schema, data }: { schema: ZodType<T>; data: unknown }) => {
	let errors: Partial<PlaceDataErrors> = {};
	const validatingData = schema.safeParse(data);
	if (!validatingData.success) {
		validatingData.error.issues.forEach((issue: { path: (string | number)[]; message: string }) => {
			errors = {
				...errors,
				[issue.path[0]]: issue.message
					.toLowerCase()
					.replace("boolean", "true or false")
					.replace("invalid enum value. expected", "must be")
					.replace("|", "or"),
			};
		});
		return {
			validData: null,
			errors,
		};
	}
	return {
		validData: validatingData.data,
		errors,
	};
};
export const validatePlaceRatingInputs = <T>({ schema, data }: { schema: ZodType<T>; data: unknown }) => {
	let errors: Partial<PlaceRateErrors> = {};
	const validatingData = schema.safeParse(data);
	if (!validatingData.success) {
		validatingData.error.issues.forEach((issue: { path: (string | number)[]; message: string }) => {
			errors = {
				...errors,
				[issue.path[0]]: issue.message
					.toLowerCase()
					.replace("boolean", "true or false")
					.replace("invalid enum value. expected", "must be")
					.replace("|", "or"),
			};
		});
		return {
			validData: null,
			errors,
		};
	}
	return {
		validData: validatingData.data,
		errors,
	};
};

export const addServerError = (serverErrorMessage: string, zodErrors: Partial<PlaceDataErrors>): ErrorResponse => {
	console.log("🚀 ~ file: index.ts:32 ~ addServerError ~ serverErrorMessage:", serverErrorMessage);
	return {
		status: "error",
		errors: Object.keys(zodErrors).length > 0 ? zodErrors : { ...zodErrors, serverError: serverErrorMessage },
	};
};

export const errorHandler = <T>(error: any, zodErrors: Partial<T>): ErrorResponse => {
	if (error instanceof Error) {
		return {
			status: "error",
			errors: Object.keys(zodErrors).length > 0 ? zodErrors : { ...zodErrors, serverError: error.message },
		};
	}
	return {
		status: "error",
		errors: Object.keys(zodErrors).length > 0 ? zodErrors : { ...zodErrors, serverError: `${error}` },
	};
};
