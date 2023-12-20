import { validateData, errorHandler } from "@/lib/utils/schema";
import { prismaDb } from "../..";
import {
  type EditPlaceRate,
  EditPlaceRateSchema,
  type placeRateUpdateResponse,
} from "@/types";

export const updatePlaceRateDbPrisma = async (
  data: EditPlaceRate
): Promise<placeRateUpdateResponse> => {
  const { errors, validData } = validateData({
    schema: EditPlaceRateSchema,
    data,
  });

  if (!validData) {
    return {
      status: "error",
      errors,
    };
  }
  try {
    const { placeId, placeRate, userId } = validData;

    const {
      ratedPlace: {
        _count: { rating: verifiedRating },
      },
    } = await prismaDb.placeRating.upsert({
      where: {
        placeId_userId: {
          placeId,
          userId,
        },
      },
      update: {
        placeReputation: placeRate,
      },
      create: {
        placeReputation: placeRate,
        ratedPlace: {
          connect: {
            id: placeId,
          },
        },
        ratedBy: {
          connect: {
            id: userId,
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
                      { placeId },
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

    const { _all } = await prismaDb.placeRating.count({
      where: { placeId },
      select: {
        _all: true,
      },
    });

    return {
      status: "success",
      data: {
        state: placeRate,
        count: 2 * verifiedRating - _all,
      },
    };
  } catch (error) {
    return errorHandler(error, errors);
  }
};
