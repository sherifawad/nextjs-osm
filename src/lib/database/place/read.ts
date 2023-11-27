import {
	FetchedPlacesResponse,
	FetchedUserPlacesCountResponse,
	FetchedUserPlacesResponse,
	GetPlaces,
	GetPlacesSchema,
	GetUserPlaces,
	GetUserPlacesSchema,
} from ".";
import { validateData, errorHandler } from "@/lib/schema-utils";
import { getPlacesDbPrisma, getUserPlacesCountDbPrisma, getUserPlacesDbPrisma } from "@/prisma/index";

export const getPlaces = async (data: GetPlaces): Promise<FetchedPlacesResponse> => {
	const { errors, validData } = validateData({ schema: GetPlacesSchema, data });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	try {
		const result = await getPlacesDbPrisma(validData);
		if (result.status === "success") {
			return {
				status: "success",
				data: result.data,
			};
		}
		return {
			status: "error",
			errors: result.errors,
		};
	} catch (error) {
		return errorHandler(error, errors);
	}
};

export const getUserPlaces = async (data: GetUserPlaces): Promise<FetchedUserPlacesResponse> => {
	const { errors, validData } = validateData({ schema: GetUserPlacesSchema, data });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	try {
		const result = await getUserPlacesDbPrisma(validData);
		if (result.status === "success") {
			return {
				status: "success",
				data: result.data,
			};
		}
		return {
			status: "error",
			errors: result.errors,
		};
	} catch (error) {
		return errorHandler(error, errors);
	}
};
export const getUserPlacesCount = async (data: GetUserPlaces): Promise<FetchedUserPlacesCountResponse> => {
	const { errors, validData } = validateData({ schema: GetUserPlacesSchema, data });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	try {
		const result = await getUserPlacesCountDbPrisma(validData);
		if (result.status === "success") {
			return {
				status: "success",
				data: result.data,
			};
		}
		return {
			status: "error",
			errors: result.errors,
		};
	} catch (error) {
		return errorHandler(error, errors);
	}
};
