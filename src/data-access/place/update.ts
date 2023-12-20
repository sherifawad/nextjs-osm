import { updatePlaceDbPrisma } from "@/prisma";
import { type EditPlace, EditPlaceSchema, placeResponse } from "@/types";
import { validateData, errorHandler } from "@/lib/utils/schema";
export const updatePlaceDb = async (
  updatedPlace: EditPlace
): Promise<placeResponse> => {
  const { errors, validData } = validateData({
    schema: EditPlaceSchema,
    data: updatedPlace,
  });

  if (!validData) {
    return {
      status: "error",
      errors,
    };
  }
  try {
    const result = await updatePlaceDbPrisma(validData);
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
