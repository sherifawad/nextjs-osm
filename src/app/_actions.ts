"use server";

import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/prisma";
import { AddPlaceFormState } from "@/lib/types/forms-types";
import {
    addPlaceSchema,
    leafletMapPageSearchParameterSchema,
} from "@/lib/validations";
import { PlaceUpdateInputSchema } from "@/lib/validations/generated-zod-schemas";
import { ominatimArraySchema } from "@/lib/validations/nominatim";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { headers } from "next/headers";
import { ZodError, z } from "zod";

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

export const addMosqueLocation = async (
    prevState: AddPlaceFormState,
    formData: FormData
): Promise<AddPlaceFormState> => {
    const name = formData.get("name") as string | null;

    try {
        const validatePlaceName = addPlaceSchema.safeParse({
            name,
        });
        if (!validatePlaceName.success) {
            const errorMap = validatePlaceName.error.flatten().fieldErrors;
            return {
                message: "error",
                errors: {
                    name: errorMap["name"]?.[0] ?? "",
                },
                fieldValues: {
                    name: name ?? "",
                },
            };
        }
        const session = await getServerSession(authOptions);
        if (!session)
            return {
                message: "error",
                errors: {
                    name: "server error",
                },
                fieldValues: {
                    name: name ?? "",
                },
            };

        if (session.user.reputation === "FAKE") {
            return {
                message: "error",
                errors: {
                    name: "Not allowed",
                },
                fieldValues: {
                    name: name ?? "",
                },
            };
        }
        const headersData = headers();

        const referer = headersData.get("referer");
        const queriesString = referer?.split("?")[1];
        if (!queriesString)
            return {
                message: "error",
                errors: {
                    name: "server error",
                },
                fieldValues: {
                    name: name ?? "",
                },
            };

        const queriesObjects = new URLSearchParams(queriesString);
        const searchParams = {
            lat: queriesObjects.get("lat"),
            lon: queriesObjects.get("lon"),
        };
        const validatedSearchParams =
            leafletMapPageSearchParameterSchema.safeParse(searchParams);

        if (!validatedSearchParams.success)
            return {
                message: "error",
                errors: {
                    name: "Wrong location parameters",
                },
                fieldValues: {
                    name: name ?? "",
                },
            };

        await db.place.create({
            data: {
                name: validatePlaceName.data.name,
                latitude: validatedSearchParams.data.lat,
                longitude: validatedSearchParams.data.lon,
                userId: session.user.id,
            },
        });
        revalidatePath("/leafletMap");
        return {
            message: "success",
            errors: undefined,
            fieldValues: {
                name: "",
            },
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                message: "error",
                errors: {
                    name: error.message,
                },
                fieldValues: {
                    name: name ?? "",
                },
            };
        }
        return {
            message: "error",
            errors: {
                name: "internal server error",
            },
            fieldValues: {
                name: name ?? "",
            },
        };
    }
};

export const removeMosqueLocation = async (id: unknown) => {
    const schema = z.string().cuid();
    try {
        const placeId = schema.safeParse(id);
        if (!placeId.success) {
            const errorMap = placeId.error.flatten().fieldErrors;
            return {
                result: "error",
                message: errorMap[0] ?? "",
            };
        }
        const session = await getServerSession(authOptions);
        if (
            !session ||
            (session.user.role !== "ADMIN" && session.user.role !== "OWNER")
        ) {
            return {
                result: "error",
                message: "not allowed",
            };
        }

        const getPlaceDb = await db.place.findUnique({
            where: {
                id: placeId.data,
            },
        });
        if (!getPlaceDb) {
            return {
                result: "error",
                message: "not exist",
            };
        }
        if (getPlaceDb.verified && session.user.role !== "OWNER") {
            return {
                result: "error",
                message: "not allowed",
            };
        }
        await db.place.delete({
            where: {
                id: placeId.data,
            },
        });

        revalidatePath("/leafletMap");
        return {
            result: "success",
            message: "deleted successfully",
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                result: "error",
                message: error.message,
            };
        }
        return {
            result: "error",
            message: "internal server error",
        };
    }
};

export const updateMosqueLocation = async (place: unknown) => {
    const schema = PlaceUpdateInputSchema.and(
        z.object({ id: z.string().cuid() })
    );
    try {
        const placeData = schema.safeParse(place);
        if (!placeData.success) {
            const errorMap = placeData.error.flatten().formErrors;
            return {
                result: "error",
                message: errorMap.map((n) => n).join(", "),
            };
        }
        const session = await getServerSession(authOptions);
        if (
            !session ||
            (session.user.role !== "ADMIN" && session.user.role !== "OWNER")
        ) {
            return {
                result: "error",
                message: "not allowed",
            };
        }

        const getPlaceDb = await db.place.findUnique({
            where: {
                id: placeData.data.id,
            },
        });
        if (!getPlaceDb) {
            return {
                result: "error",
                message: "not exist",
            };
        }
        if (getPlaceDb.verified && session.user.role !== "OWNER") {
            return {
                result: "error",
                message: "not allowed",
            };
        }
        await db.place.update({
            where: {
                id: placeData.data.id,
            },
            data: {
                ...placeData.data,
            },
        });

        revalidatePath("/leafletMap");
        return {
            result: "success",
            message: "updated successfully",
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                result: "error",
                message: error.message,
            };
        }
        return {
            result: "error",
            message: "internal server error",
        };
    }
};
