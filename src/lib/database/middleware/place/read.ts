import {
	type FetchedPlaceResponse,
	type FetchedPlacesResponse,
	type FetchedUserPlacesCountResponse,
	type FetchedUserPlacesResponse,
	type GetPlace,
	type GetPlaces,
	type GetUserPlaces,
	GetPlaceSchema,
	GetPlacesSchema,
	GetUserPlacesSchema,
} from "@/types";
import { validateData, errorHandler } from "@/lib/schema-utils";
import { getPlaceDbPrisma, getPlacesDbPrisma, getUserPlacesCountDbPrisma, getUserPlacesDbPrisma } from "@/prisma";

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
export const getPlace = async (data: GetPlace): Promise<FetchedPlaceResponse> => {
	const { errors, validData } = validateData({ schema: GetPlaceSchema, data });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	try {
		const result = await getPlaceDbPrisma(validData);
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
