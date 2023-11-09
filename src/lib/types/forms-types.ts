import { z } from "zod";
import { addPlaceSchema } from "../validations";
import {
    Place,
    PlaceCreateInputSchema,
} from "../validations/generated-zod-schemas";

export type AddPlaceForm = z.infer<typeof addPlaceSchema>;
export type EditPlaceForm = z.infer<typeof PlaceCreateInputSchema>;

export type AddPlaceFormState = {
    message: string;
    errors: Record<keyof AddPlaceForm, string> | undefined;
    fieldValues: AddPlaceForm;
};

export type EditPlaceFieldValues = Omit<
    Place,
    "createdById" | "modifiedById" | "createdAt" | "modifiedAt"
>;

export type EditPlaceFormState = {
    message: string;
    errors:
        | Partial<Record<keyof Partial<EditPlaceForm>, string[] | undefined>>
        | undefined;
    fieldValues: EditPlaceFieldValues;
};
