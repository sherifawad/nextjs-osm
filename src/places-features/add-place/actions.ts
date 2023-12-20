"use server";

import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { leafletMapPageSearchParameterSchema } from "@/types/searchParams-schema";
import { revalidatePath } from "next/cache";
import { addPlaceFormSchema } from "./validation";
import { validateData, errorHandler, addServerError } from "@/lib/utils/schema";
import { type placeResponse } from "@/types";
import { createPlaceDb } from "@/data-access";
import { authOptions } from "@/lib/auth/options";

export const addPlaceLocation = async (name: {
  name: string;
}): Promise<placeResponse> => {
  let { errors, validData } = validateData({
    schema: addPlaceFormSchema,
    data: name,
  });
  if (!validData) {
    return {
      status: "error",
      errors,
    };
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return addServerError("Not Authenticated", errors);
    }

    if (session.user.userReputation < 1) {
      return addServerError("Not authorized, low reputation", errors);
    }
    const headersData = headers();

    const referer = headersData.get("referer");
    const queriesString = referer?.split("?")[1];
    if (!queriesString) {
      return addServerError("InValid URL Data", errors);
    }

    const queriesObjects = new URLSearchParams(queriesString);
    const searchParams = {
      lat: queriesObjects.get("lat"),
      lon: queriesObjects.get("lon"),
    };
    const validatedSearchParams =
      leafletMapPageSearchParameterSchema.safeParse(searchParams);

    if (!validatedSearchParams.success) {
      return addServerError("Wrong location parameters", errors);
    }

    const result = await createPlaceDb({
      name: validData.name,
      latitude: validatedSearchParams.data.lat,
      longitude: validatedSearchParams.data.lon,
      createdById: session.user.id,
    });

    if (result.status === "success") {
      revalidatePath("/leafletMap");
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
    console.log("🚀 ~ file: actions.ts:68 ~ addPlaceLocation ~ error:", error);
    return errorHandler(error, errors);
  }
};
