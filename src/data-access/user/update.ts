import { type EditUser, type userResponse, EditUserSchema } from "@/types";
import { validateData, errorHandler } from "@/lib/schema-utils";
import { updateUserDbPrisma } from "@/prisma/user/update";

export const updateUserDb = async (updatedPlace: EditUser): Promise<userResponse> => {
	const { errors, validData } = validateData({ schema: EditUserSchema, data: updatedPlace });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	try {
		const result = await updateUserDbPrisma(validData);
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
