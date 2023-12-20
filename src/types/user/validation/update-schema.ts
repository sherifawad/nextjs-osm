import { z } from "zod";
import { UserDbOptionalSchema } from "./user-schema";
/////////////////////////////////////////
// EDIT USER SCHEMA
/////////////////////////////////////////

export const EditUserSchema = UserDbOptionalSchema.merge(
  z.object({
    id: z.string().cuid(),
  }),
);
export type EditUser = z.infer<typeof EditUserSchema>;
