import { validateData, errorHandler } from "@/lib/utils/schema";
import { prismaDb } from "..";
import { EditUser, EditUserSchema, userResponse } from "@/types";

export const updateUserDbPrisma = async (
  data: EditUser,
): Promise<userResponse> => {
  const { errors, validData } = validateData({ schema: EditUserSchema, data });

  if (!validData) {
    return {
      status: "error",
      errors,
    };
  }
  try {
    const { id, ...rest } = validData;

    const dbResult = await prismaDb.user.update({
      where: {
        id,
      },
      data: {
        ...rest,
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
