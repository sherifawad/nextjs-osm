import { prismaDb } from "..";
import { type AddPlace, AddPlaceSchema, type placeResponse } from "@/types";
import { validateData, errorHandler } from "@/lib/utils/schema";

export const createPlaceDbPrisma = async (
  data: AddPlace
): Promise<placeResponse> => {
  const { errors, validData } = validateData({ schema: AddPlaceSchema, data });

  if (!validData) {
    return {
      status: "error",
      errors,
    };
  }
  try {
    const { id, modifiedAt, modifiedById, createdAt, createdById, ...rest } =
      validData;

    const dbResult = await prismaDb.place.create({
      data: {
        ...rest,
        createdBy: {
          connect: {
            id: createdById,
          },
        },
      },
    });
    return {
      status: "success",
      data: dbResult,
    };
  } catch (error) {
    return errorHandler(error, errors);
  }
};
