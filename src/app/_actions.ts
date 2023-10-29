"use server";

import { ominatimArraySchema } from "@/lib/validations/nominatim";

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
            "https://nominatim.openstreetmap.org/search?" + query
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
