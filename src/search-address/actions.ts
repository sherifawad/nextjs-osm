"use server";

import { errorHandler, validateData } from "@/lib/schema-utils";
import {
	NominatedPlaceResponse,
	NominatedPlaceSchema,
	SearchAddressesErrorsSchemaErrors,
	SearchAddressesInput,
	searchAddressesInputSchema,
} from "./validations";

export const getSuggestions = async (searchInput: SearchAddressesInput): Promise<NominatedPlaceResponse> => {
	const { errors, validData } = validateData({ schema: searchAddressesInputSchema, data: searchInput });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}

	try {
		const params = {
			q: validData.search,
			featuretype: "administrative",
			format: "json",
			addressdetails: "1",
			limit: "7",
			// extratags: "1",
		};
		const query = new URLSearchParams(params).toString();
		const response = await fetch("https://nominatim.openstreetmap.org/search?" + query, {
			method: "GET",
			headers: {
				"Accept-Language": "ar",
			},
		});
		const data: unknown = await response.json();

		const { errors: placesErrors, validData: places } = validateData({
			schema: NominatedPlaceSchema.array(),
			data,
		});
		if (!places) {
			return {
				status: "error",
				errors: { ...errors, ...placesErrors },
			};
		}
		return {
			status: "success",
			data: places,
		};
	} catch (error) {
		return errorHandler(error, errors);
	}
};
