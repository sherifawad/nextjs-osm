"use server";

import { leafletMapPageSearchParameterSchema } from "@/lib/validations";
import { ominatimArraySchema } from "@/lib/validations/nominatim";

import { headers } from "next/headers";

export const getSuggestions = async (searchInput: string) => {
    if (searchInput == null) return null;

    try {
        const params = {
            q: searchInput,
            featuretype: "administrative",
            format: "json",
            addressdetails: "1",
            limit: "5",
            // extratags: "1",
        };
        const query = new URLSearchParams(params).toString();
        const response = await fetch(
            "https://nominatim.openstreetmap.org/search?" + query,
            {
                method: "GET",
                headers: {
                    "Accept-Language": "ar",
                },
            }
        );
        const data: unknown = await response.json();

        const validateLocationData = ominatimArraySchema.safeParse(data);
        if (validateLocationData.success) {
            return validateLocationData.data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};

export const addMosqueLocation = async () => {
    //TODO: check if the user has permission to suggest a location
    try {
        const headersData = headers();

        const referer = headersData.get("referer");
        const queriesString = referer?.split("?")[1];
        if (!queriesString) return null;

        const queriesObjects = new URLSearchParams(queriesString);
        const searchParams = {
            lat: queriesObjects.get("lat"),
            lon: queriesObjects.get("lon"),
        };
        const validatedSearchParams =
            leafletMapPageSearchParameterSchema.safeParse(searchParams);
        //TODO: add the suggestion the database to be added later

        if (!validatedSearchParams.success) return null;
    } catch (error) {
        return null;
    }
};
