import { z } from "zod";
import { addPlaceSchema } from "../validations";

export type AddPlaceForm = z.infer<typeof addPlaceSchema>;

export type AddPlaceFormState = {
    message: string;
    errors: Record<keyof AddPlaceForm, string> | undefined;
    fieldValues: AddPlaceForm;
};
