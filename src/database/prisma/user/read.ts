import { validateData, errorHandler } from "@/lib/utils/schema";
import { prismaDb } from "..";
import {
  type FetchedPlaceResponse,
  type GetPlace,
  type GetUser,
  type userResponse,
  GetUserSchema,
  GetPlaceSchema,
  GetUsers,
  GetUsersSchema,
  UsersResponse,
  UsersCountResponse,
} from "@/types";

export const getUserDbPrisma = async (data: GetUser): Promise<userResponse> => {
  const { errors, validData } = validateData({ schema: GetUserSchema, data });

  if (!validData) {
    return {
      status: "error",
      errors,
    };
  }

  try {
    const dbResult = await prismaDb.user.findUniqueOrThrow({
      where: {
        id: validData.id,
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

export const getPlaceDbPrisma = async (
  data: GetPlace
): Promise<FetchedPlaceResponse> => {
  const { errors, validData } = validateData({ schema: GetPlaceSchema, data });

  if (!validData) {
    return {
      status: "error",
      errors,
    };
  }
  try {
    const dbResult = await prismaDb.place.findUniqueOrThrow({
      where: {
        id: validData.id,
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

export const getUsersDbPrisma = async (
  data: GetUsers
): Promise<UsersResponse> => {
  const { errors, validData } = validateData({ schema: GetUsersSchema, data });

  if (!validData) {
    return {
      status: "error",
      errors,
    };
  }

  let whereData = {};

  try {
    if (validData.search && validData.columnToFilter) {
      whereData = {
        ...whereData,
        OR: validData.columnToFilter?.map((value) => ({
          [value]: {
            contains: validData.search,
            mode: "insensitive",
          },
        })),
      };
    }

    if (validData.role) {
      whereData = { ...whereData, role: validData.role };
    }

    const sortData = validData.columnToSort?.map((value) => ({
      [value]: validData.sorting,
    }));

    const dbResult = await prismaDb.user.findMany({
      where: whereData,
      skip: validData.skip,
      take: validData.take,
      include: {
        rating: {
          select: {
            placeReputation: true,
          },
        },
      },
      orderBy: sortData,
    });

    return {
      status: "success",
      data: dbResult,
    };
  } catch (error) {
    return errorHandler(error, errors);
  }
};

export const getUsersCountDbPrisma = async (
  data: GetUsers
): Promise<UsersCountResponse> => {
  const { errors, validData } = validateData({ schema: GetUsersSchema, data });

  if (!validData) {
    return {
      status: "error",
      errors,
    };
  }
  let whereData: any = {};

  try {
    if (validData.search && validData.columnToFilter) {
      whereData = {
        ...whereData,
        OR: validData.columnToFilter?.map((value) => ({
          [value]: {
            contains: validData.search,
            mode: "insensitive",
          },
        })),
      };
    }

    if (validData.role) {
      whereData = { ...whereData, role: validData.role };
    }

    const dbResult = await prismaDb.user.count({
      where: whereData,
    });

    return {
      status: "success",
      data: dbResult,
    };
  } catch (error) {
    return errorHandler(error, errors);
  }
};

export const isUserAccountBlockedDbPrisma = async ({
  provider,
  providerAccountId,
}: {
  provider: string;
  providerAccountId: string;
}) => {
  try {
    const dbResult = await prismaDb.account.findUniqueOrThrow({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
    });
    return dbResult.blocked;
  } catch (error) {
    return false;
  }
};
