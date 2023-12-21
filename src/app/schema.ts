import { splitStringToArray } from "@/lib/utils/array";
import { UserPlaces, type User } from "@/types";
import { sortingSchema } from "@/types/common";
import { z } from "zod";

export const BasicSearchParamsSchema = z.object({
  page: z.coerce.number(),
  size: z.coerce.number(),
  sort: sortingSchema,
  search: z.coerce.string(),
});

export type BasicSearchParams = z.infer<typeof BasicSearchParamsSchema>;

export const UserSearchParamsSchema = BasicSearchParamsSchema.merge(
  z.object({
    column: z
      .string()
      .transform((val) => splitStringToArray(val, ","))
      .pipe(z.custom<keyof User>().array()),
    filter: z
      .string()
      .optional()
      .transform((val) => (val ? splitStringToArray(val, ",") : undefined))
      .pipe(z.custom<keyof User>().array().optional()),
  })
).refine(
  (data) => {
    return !data.search || data.search?.length < 1
      ? true
      : data.filter
        ? true
        : false;
  },
  {
    message: "no column to filter exist",
    path: ["filter"],
  }
);

export type UserSearchParams = z.infer<typeof UserSearchParamsSchema>;

export const PlacesSearchParamsSchema = BasicSearchParamsSchema.merge(
  z.object({
    column: z.custom<keyof UserPlaces>(),
    filter: z.custom<keyof UserPlaces>().optional(),
  })
).refine(
  (data) => {
    return !data.search || data.search?.length < 1
      ? true
      : data.filter
        ? true
        : false;
  },
  {
    message: "no column to filter exist",
    path: ["filter"],
  }
);

export type PlacesSearchParams = z.infer<typeof PlacesSearchParamsSchema>;
