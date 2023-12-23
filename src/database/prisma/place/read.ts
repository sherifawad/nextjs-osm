import { prismaDb } from "..";
import {
  type FetchedPlacesResponse,
  type FetchedUserPlacesCountResponse,
  type FetchedUserPlacesResponse,
  type GetPlaces,
  GetPlacesSchema,
  GetUserPlaces,
  GetUserPlacesSchema,
} from "@/types";
import { validateData, errorHandler } from "@/lib/utils/schema";

export const getPlacesDbPrisma = async (
  data: GetPlaces
): Promise<FetchedPlacesResponse> => {
  const { errors, validData } = validateData({ schema: GetPlacesSchema, data });

  if (!validData) {
    return {
      status: "error",
      errors,
    };
  }
  try {
    const whereData = {
      deleted: validData.deletedPlaces,
      hidden: validData.hiddenPlaces,
    };
    const dbResult = await prismaDb.place.findMany({
      where: whereData,
      include: {
        rating: {
          select: {
            userId: true,
            placeReputation: true,
          },
        },
        _count: {
          select: {
            rating: {
              where: {
                placeReputation: "VERIFIED",
              },
            },
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

export const getUserPlacesDbPrisma = async (
  data: GetUserPlaces
): Promise<FetchedUserPlacesResponse> => {
  const { errors, validData } = validateData({
    schema: GetUserPlacesSchema,
    data,
  });

  if (!validData) {
    return {
      status: "error",
      errors,
    };
  }
  let whereData = {};
  let sortData: any = validData.columnToSort?.map((value) => ({
    [value]: validData.sorting,
  }));

  try {
    if (validData.placeType === "CREATED") {
      whereData = { ...whereData, createdById: validData.id };
    } else if (validData.placeType === "MODIFIED") {
      whereData = { ...whereData, modifiedById: validData.id };
    } else if (validData.placeType === "BOTH") {
      whereData = {
        ...whereData,
        OR: [{ modifiedById: validData.id }, { createdById: validData.id }],
      };
    }
    if (validData.search && validData.columnToFilter) {
      if (!isNaN(Number(validData.search))) {
        whereData = {
          ...whereData,
          OR: validData.columnToFilter
            ?.filter((x) => x === "latitude" || x === "longitude")
            .map((value) => {
              return {
                AND: [
                  {
                    [value]: {
                      lte:
                        Math.round(
                          (Number(validData.search) + Number.EPSILON) * 100
                        ) /
                          100 +
                        0.05,
                    },
                  },
                  {
                    [value]: {
                      gte:
                        Math.round(
                          (Number(validData.search) + Number.EPSILON) * 100
                        ) /
                          100 -
                        0.05,
                    },
                  },
                ],
              };
            }),
        };
      } else {
        whereData = {
          ...whereData,
          OR: validData.columnToFilter
            ?.filter((x) => x === "arName" || x === "enName" || x === "name")
            .map((value) => {
              return {
                [value]: {
                  contains: validData.search,
                  mode: "insensitive",
                },
              };
            }),
        };
      }
    }

    whereData = {
      ...whereData,
      deleted: validData.deletedPlaces,
      hidden: validData.hiddenPlaces,
    };

    if (validData.columnToSort.includes("rating")) {
      sortData = {
        ...sortData,
        rating: {
          _count: validData.sorting,
        },
      };
    }
    const dbResult = await prismaDb.place.findMany({
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

export const getUserPlacesCountDbPrisma = async (
  data: GetUserPlaces
): Promise<FetchedUserPlacesCountResponse> => {
  const { errors, validData } = validateData({
    schema: GetUserPlacesSchema,
    data,
  });

  if (!validData) {
    return {
      status: "error",
      errors,
    };
  }
  let whereData: any = {};

  try {
    if (validData.placeType === "CREATED") {
      whereData = { ...whereData, createdById: validData.id };
    } else if (validData.placeType === "MODIFIED") {
      whereData = { ...whereData, modifiedById: validData.id };
    } else {
      whereData = {
        ...whereData,
        OR: [{ modifiedById: validData.id }, { createdById: validData.id }],
      };
    }
    if (validData.search && validData.columnToFilter) {
      if (!isNaN(Number(validData.search))) {
        whereData = {
          ...whereData,
          OR: validData.columnToFilter
            ?.filter((x) => x === "latitude" || x === "longitude")
            .map((value) => {
              return {
                AND: [
                  {
                    [value]: {
                      lte:
                        Math.round(
                          (Number(validData.search) + Number.EPSILON) * 100
                        ) /
                          100 +
                        0.05,
                    },
                  },
                  {
                    [value]: {
                      gte:
                        Math.round(
                          (Number(validData.search) + Number.EPSILON) * 100
                        ) /
                          100 -
                        0.05,
                    },
                  },
                ],
              };
            }),
        };
      } else {
        whereData = {
          ...whereData,
          OR: validData.columnToFilter
            ?.filter((x) => x === "arName" || x === "enName" || x === "name")
            .map((value) => {
              return {
                [value]: {
                  contains: validData.search,
                  mode: "insensitive",
                },
              };
            }),
        };
      }
    }

    whereData = {
      ...whereData,
      deleted: validData.deletedPlaces,
      hidden: validData.hiddenPlaces,
    };

    const dbResult = await prismaDb.place.count({
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
