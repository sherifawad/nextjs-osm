import { FetchedUserResponse, GetUser, GetUserSchema } from ".";
import { errorHandler, validateData } from "@/lib/schema-utils";
import { getUserDbPrisma } from "../prisma";

// export const getUsers = async (): Promise<userResponse> => {
// 	let errors: Partial<UserDataErrors> = {};

// 	try {
// 		const result = await getUsersDbPrisma();
// 		if (result.status === "success") {
// 			return {
// 				status: "success",
// 				data: result.data,
// 			};
// 		}
// 		return {
// 			status: "error",
// 			errors: result.errors,
// 		};
// 	} catch (error) {
// 		return errorHandler(error, errors);
// 	}
// };

export const getUser = async (data: GetUser): Promise<FetchedUserResponse> => {
	const { errors, validData } = validateData({ schema: GetUserSchema, data });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	try {
		const result = await getUserDbPrisma(validData);
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
