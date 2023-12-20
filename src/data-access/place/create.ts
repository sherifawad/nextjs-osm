import { createPlaceDbPrisma } from "@/prisma";
import { type AddPlace, AddPlaceSchema, type placeResponse } from "@/types";
import { validateData, errorHandler } from "@/lib/utils/schema";

export const createPlaceDb = async (
  newPlace: AddPlace,
): Promise<placeResponse> => {
  const { errors, validData } = validateData({
    schema: AddPlaceSchema,
    data: newPlace,
  });

  if (!validData) {
    return {
      status: "error",
      errors,
    };
  }
  try {
    const result = await createPlaceDbPrisma(validData);
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
