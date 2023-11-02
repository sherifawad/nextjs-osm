import z from "zod";
import { ominatimSchema } from "../validations/nominatim";

export type SearchStatus =
    | "pending"
    | "complete"
    | "error"
    | "success"
    | undefined;

export type Tominatim = z.infer<typeof ominatimSchema>;

export type TPosition = {
    lat: number;
    lon: number;
};

export type fetchStatus = {
    idle: "idle";
    pending: "pending";
    delayed: "delayed";
    completed: "completed";
    success: "success";
    error: "error";
};
