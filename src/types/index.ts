import z from "zod";
import { placeRateSearchParameterSchema } from "./searchParams-schema";

// combine types into better format
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type placeRateSearchParameter = z.infer<
  typeof placeRateSearchParameterSchema
>;

export type fetchStatus = {
  idle: "idle";
  pending: "pending";
  delayed: "delayed";
  completed: "completed";
  success: "success";
  error: "error";
};

export * from "./place/index";
export * from "./user/index";
