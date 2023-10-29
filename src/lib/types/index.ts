import z from "zod";
import { ominatimSchema } from "../validations/nominatim";

export type Tominatim = z.infer<typeof ominatimSchema>;

export type fetchStatus = {
    idle: "idle";
    pending: "pending";
    delayed: "delayed";
    completed: "completed";
    success: "success";
    error: "error";
};
