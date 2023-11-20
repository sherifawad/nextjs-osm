"use server";

import { authOptions } from "@/lib/authOptions";
import { prismaDb as db } from "@/lib/database/prisma/index";
import {
	EditPlaceFieldValues,
	EditPlaceForm,
	EditPlaceFormDataErrors,
	EditPlaceFormState,
	updateMosqueLocationResult,
} from "@/lib/types/forms-types";
import { ominatimArraySchema } from "@/lib/validations/nominatim";
import { EditPlaceSchema } from "@/lib/validations/place-schema";
import {
	leafletMapPageSearchParameterSchema,
	placeRateSchema,
	placeRateSearchParameterSchema,
} from "@/lib/validations/searchParams-schema";
import REPUTATIONSchema, { REPUTATIONType } from "@/schema/inputTypeSchemas/REPUTATIONSchema";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { headers } from "next/headers";
import { ZodError, z } from "zod";
import { RedirectType, redirect } from "next/navigation";

const placeDefaults: EditPlaceFieldValues = {
	id: "",
	name: "",
	arName: "",
	enName: "",
	latitude: 0,
	longitude: 0,
	image: "",
	deleted: false,
	verified: false,
	hidden: false,
};

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
		const response = await fetch("https://nominatim.openstreetmap.org/search?" + query, {
			method: "GET",
			headers: {
				"Accept-Language": "ar",
			},
		});
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

// export const addMosqueLocation = async (
// 	prevState: AddPlaceFormState,
// 	formData: FormData
// ): Promise<AddPlaceFormState> => {
// 	const name = formData.get("name") as string | null;

// 	try {
// 		const validatePlaceName = addPlaceSchema.safeParse({
// 			name,
// 		});
// 		if (!validatePlaceName.success) {
// 			const errorMap = validatePlaceName.error.flatten().fieldErrors;
// 			return {
// 				message: "error",
// 				errors: {
// 					name: errorMap["name"]?.[0] ?? "",
// 				},
// 				fieldValues: {
// 					name: name ?? "",
// 				},
// 			};
// 		}
// 		const session = await getServerSession(authOptions);
// 		if (!session)
// 			return {
// 				message: "error",
// 				errors: {
// 					name: "server error",
// 				},
// 				fieldValues: {
// 					name: name ?? "",
// 				},
// 			};

// 		if (session.user.userReputation < 1) {
// 			return {
// 				message: "error",
// 				errors: {
// 					name: "Not allowed",
// 				},
// 				fieldValues: {
// 					name: name ?? "",
// 				},
// 			};
// 		}
// 		const headersData = headers();

// 		const referer = headersData.get("referer");
// 		const queriesString = referer?.split("?")[1];
// 		if (!queriesString)
// 			return {
// 				message: "error",
// 				errors: {
// 					name: "server error",
// 				},
// 				fieldValues: {
// 					name: name ?? "",
// 				},
// 			};

// 		const queriesObjects = new URLSearchParams(queriesString);
// 		const searchParams = {
// 			lat: queriesObjects.get("lat"),
// 			lon: queriesObjects.get("lon"),
// 		};
// 		const validatedSearchParams = leafletMapPageSearchParameterSchema.safeParse(searchParams);

// 		if (!validatedSearchParams.success)
// 			return {
// 				message: "error",
// 				errors: {
// 					name: "Wrong location parameters",
// 				},
// 				fieldValues: {
// 					name: name ?? "",
// 				},
// 			};

// 		await db.place.create({
// 			data: {
// 				name: validatePlaceName.data.name,
// 				latitude: validatedSearchParams.data.lat,
// 				longitude: validatedSearchParams.data.lon,
// 				createdBy: {
// 					connect: {
// 						id: session.user.id,
// 					},
// 				},
// 			},
// 		});
// 		revalidatePath("/leafletMap");
// 		return {
// 			message: "success",
// 			errors: undefined,
// 			fieldValues: {
// 				name: "",
// 			},
// 		};
// 	} catch (error) {
// 		if (error instanceof Error) {
// 			return {
// 				message: "error",
// 				errors: {
// 					name: error.message,
// 				},
// 				fieldValues: {
// 					name: name ?? "",
// 				},
// 			};
// 		}
// 		return {
// 			message: "error",
// 			errors: {
// 				name: "internal server error",
// 			},
// 			fieldValues: {
// 				name: name ?? "",
// 			},
// 		};
// 	}
// };

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
		if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
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

// export const updateMosqueLocation = async (
//     prevState: EditPlaceFormState,
//     formData: FormData
// ): Promise<EditPlaceFormState> => {
//     const schema = PlaceUpdateInputSchema.and(
//         z.object({
//             id: z.string().cuid(),
//             name: z.string().min(1),
//             latitude: z.coerce.number(),
//             longitude: z.coerce.number(),
//         })
//     );
//     console.log("🚀 ~ file: _actions.ts:275 ~ formData:", formData);
//     const place: EditPlaceFieldValues = {
//         id: formData.get("id") as string,
//         name: formData.get("name") as string,
//         latitude: parseFloat((formData.get("latitude") ?? "") as string),
//         longitude: parseFloat((formData.get("longitude") ?? "") as string),
//         arName: formData.get("arName") as string | null,
//         enName: formData.get("enName") as string | null,
//         verified: formData.get("verified") === "null" ? false : true,
//         deleted: formData.get("deleted") === "null" ? false : true,
//         hidden: formData.get("hidden") === "null" ? false : true,
//         image: formData.get("image") as string | null,
//     };
//     console.log("🚀 ~ file: _actions.ts:286 ~ place:", place);

//     try {
//         const placeData = schema.safeParse(place);
//         if (!placeData.success) {
//             const errorMap = placeData.error.flatten().fieldErrors;

//             return {
//                 message: "error",
//                 errors: errorMap,
//                 fieldValues: place,
//             };
//         }
//         const session = await getServerSession(authOptions);
//         if (
//             !session ||
//             (session.user.role !== "ADMIN" && session.user.role !== "OWNER")
//         ) {
//             return {
//                 message: "error",
//                 errors: {
//                     name: ["Not authorized to update"],
//                 },
//                 fieldValues: place,
//             };
//         }

//         const getPlaceDb = await db.place.findUnique({
//             where: {
//                 id: placeData.data.id,
//             },
//         });
//         if (!getPlaceDb) {
//             return {
//                 message: "error",
//                 errors: {
//                     name: ["Not Exist"],
//                 },
//                 fieldValues: place,
//             };
//         }
//         const {
//             id,
//             modifiedAt,
//             modifiedById,
//             createdAt,
//             createdById,
//             ...otherPlaceDb
//         } = getPlaceDb;
//         if (getPlaceDb.verified && session.user.role !== "OWNER") {
//             return {
//                 message: "error",
//                 errors: {
//                     name: ["Not authorized to update"],
//                 },
//                 fieldValues: place,
//             };
//         }
//         await db.place.update({
//             where: {
//                 id: placeData.data.id,
//             },
//             data: {
//                 ...otherPlaceDb,
//                 ...placeData.data,
//                 modifiedBy: {
//                     connect: {
//                         id: session.user.id,
//                     },
//                 },
//             },
//         });

//         revalidatePath("/leafletMap");
//         return {
//             message: "success",
//             errors: undefined,
//             fieldValues: place,
//         };
//     } catch (error) {
//         if (error instanceof Error) {
//             return {
//                 message: "error",
//                 errors: {
//                     name: [error.message],
//                 },
//                 fieldValues: place,
//             };
//         }
//         return {
//             message: "error",
//             errors: {
//                 name: ["internal server error"],
//             },
//             fieldValues: place,
//         };
//     }
// };

export const updateMosqueLocation = async (place: unknown): Promise<updateMosqueLocationResult> => {
	let zodErrors: Partial<EditPlaceFormDataErrors> = {};
	try {
		const placeData = EditPlaceSchema.safeParse(place);
		if (!placeData.success) {
			placeData.error.issues.forEach((issue: { path: (string | number)[]; message: string }) => {
				zodErrors = {
					...zodErrors,
					[issue.path[0]]: issue.message
						.toLowerCase()
						.replace("boolean", "true or false")
						.replace("invalid enum value. expected", "must be")
						.replace("|", "or"),
				};
			});
			throw new Error("zodError");
		}
		const session = await getServerSession(authOptions);
		if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
			zodErrors = {
				...zodErrors,
				serverError: "Not authorized to update",
			};

			throw new Error("zodError");
		}

		const getPlaceDb = await db.place.findUnique({
			where: {
				id: placeData.data.id,
			},
		});
		if (!getPlaceDb) {
			zodErrors = {
				...zodErrors,
				serverError: "Not Exist",
			};

			throw new Error("zodError");
		}

		if (getPlaceDb.verified && session.user.role !== "OWNER") {
			zodErrors = {
				...zodErrors,
				serverError: "Not authorized to update",
			};

			throw new Error("zodError");
		}

		const { id, ...otherPlaceData } = placeData.data;
		const result = await db.place.update({
			where: {
				id: placeData.data.id,
			},
			data: {
				...placeData.data,
				modifiedBy: {
					connect: {
						id: session.user.id,
					},
				},
			},
		});

		revalidatePath("/leafletMap");
		return {
			status: "Success",
			data: result,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				status: "Error",
				errors: Object.keys(zodErrors).length > 0 ? zodErrors : { ...zodErrors, serverError: error.message },
			};
		}
		return {
			status: "Error",
			errors: Object.keys(zodErrors).length > 0 ? zodErrors : { ...zodErrors, serverError: `${error}` },
		};
	}
};

type ratePlaceProps = {
	placeRate: REPUTATIONType;
	placeId: string;
};

export const ratePlace = async (data: unknown) => {
	const ratePlaceSchema = z.object({
		placeRate: REPUTATIONSchema,
	});
	let url: string | undefined;
	try {
		const validatedData = ratePlaceSchema.safeParse(data);
		if (!validatedData.success) {
			return {
				status: "Error",
				error: "InValid Input",
			};
		}
		const headersData = headers();
		const host = headersData.get("host");

		const referer = headersData.get("referer");
		const queriesString = referer?.split("?")[1];
		if (!queriesString) {
			return {
				status: "Error",
				error: "InValid URL Data",
			};
		}

		const queriesObjects = new URLSearchParams(queriesString);
		const searchParamsData = {
			count: queriesObjects.get("count"),
			lat: queriesObjects.get("lat"),
			lon: queriesObjects.get("lon"),
		};
		const validatedParams = placeRateSearchParameterSchema.safeParse(searchParamsData);
		if (!validatedParams.success) {
			return {
				status: "Error",
				error: "InValid Params Data",
			};
		}

		const session = await getServerSession(authOptions);
		if (!session) {
			return {
				status: "Error",
				error: "UnAuthenticated",
			};
		}

		const placeDb = await db.place.findFirst({
			where: {
				latitude: validatedParams.data.lat,
				longitude: validatedParams.data.lon,
			},
		});
		if (!placeDb) {
			return {
				status: "Error",
				error: "Wrong Place",
			};
		}

		const {
			ratedPlace: {
				_count: { rating: verifiedRating },
			},
		} = await db.placeRating.upsert({
			where: {
				placeId_userId: {
					placeId: placeDb.id,
					userId: session.user.id,
				},
			},
			update: {
				placeReputation: validatedData.data.placeRate,
			},
			create: {
				placeReputation: validatedData.data.placeRate,
				ratedPlace: {
					connect: {
						id: placeDb.id,
					},
				},
				ratedBy: {
					connect: {
						id: session.user.id,
					},
				},
			},
			include: {
				ratedPlace: {
					select: {
						_count: {
							select: {
								rating: {
									where: {
										AND: [
											{ placeId: placeDb.id },
											{
												placeReputation: "VERIFIED",
											},
										],
									},
								},
							},
						},
					},
				},
			},
		});

		const { _all } = await db.placeRating.count({
			where: { placeId: placeDb.id },
			select: {
				_all: true,
			},
		});

		const newParams = new URLSearchParams(queriesObjects);
		newParams.set("count", `${2 * verifiedRating - _all}`);
		newParams.set("rate", `${validatedData.data.placeRate}`);
		// revalidatePath("/leafletMap", "page");
		url = `/leafletMap?${newParams}`;
	} catch (error) {
		if (error instanceof Error) {
			return {
				status: "Error",
				error: error.message,
			};
		}
		return {
			status: "Error",
			error: `${error}`,
		};
	} finally {
		if (url) {
			redirect(url, RedirectType.replace);
		}
	}
};
