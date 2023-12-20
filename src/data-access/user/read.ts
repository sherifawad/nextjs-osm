import {
  type GetUser,
  GetUserSchema,
  type userResponse,
  UserDataErrors,
  GetUsers,
  UsersResponse,
  GetUsersSchema,
  UsersCountResponse,
} from "@/types";
import { validateData, errorHandler } from "@/lib/utils/schema";
import {
  getUserDbPrisma,
  getUsersCountDbPrisma,
  getUsersDbPrisma,
  isUserAccountBlockedDbPrisma,
} from "@/prisma";
import {
  AccountBlockStatusResponse,
  GetAccountBlockStatus,
  GetAccountBlockStatusSchema,
} from "@/types/account/validation/read-schema";

export const getUsers = async (data: GetUsers): Promise<UsersResponse> => {
  const { errors, validData } = validateData({ schema: GetUsersSchema, data });

  if (!validData) {
    return {
      status: "error",
      errors,
    };
  }
  try {
    const result = await getUsersDbPrisma(validData);
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

export const getUsersCount = async (
  data: GetUsers,
): Promise<UsersCountResponse> => {
  const { errors, validData } = validateData({ schema: GetUsersSchema, data });

  if (!validData) {
    return {
      status: "error",
      errors,
    };
  }
  try {
    const result = await getUsersCountDbPrisma(validData);
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

export const getUser = async (data: GetUser): Promise<userResponse> => {
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

export const isUserAccountBlocked = async (
  data: GetAccountBlockStatus,
): Promise<AccountBlockStatusResponse> => {
  const { errors, validData } = validateData({
    schema: GetAccountBlockStatusSchema,
    data,
  });

  if (!validData) {
    return {
      status: "error",
      errors,
    };
  }
  try {
    const dbResult = await isUserAccountBlockedDbPrisma({
      provider: validData.provider,
      providerAccountId: validData.providerAccountId,
    });
    return { status: "success", data: dbResult };
  } catch (error) {
    return errorHandler(error, errors);
  }
};
