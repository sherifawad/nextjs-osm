import { z } from "zod";

export const addPlaceFormSchema = z.object({
  name: z.string().min(3),
});

export type TAddPlaceForm = z.infer<typeof addPlaceFormSchema>;
export const addPlaceFormDataErrorsSchema = z
  .object({
    serverError: z.string().optional(),
  })
  .merge(addPlaceFormSchema)
  .optional();

export type addPlaceFormDataErrors = {
  [key in keyof z.infer<typeof addPlaceFormDataErrorsSchema>]: string;
};
