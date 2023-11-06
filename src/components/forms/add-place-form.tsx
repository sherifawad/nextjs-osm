"use client";

import { addMosqueLocation } from "@/app/_actions";
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import { Input } from "../ui/input";
import { useFormStatus } from "react-dom";
import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { CheckCircle, LoaderIcon } from "lucide-react";

const SubmitButton = () => {
    const { pending } = useFormStatus();

    return (
        <Button disabled={pending} type="submit">
            {pending ? (
                <LoaderIcon className="w-6 h-6 shrink-0 animate-spin" />
            ) : (
                "Submit"
            )}
        </Button>
    );
};

function AddPlaceForm() {
    const formRef = useRef<HTMLFormElement>(null);

    const [formState, formAction] = useFormState(addMosqueLocation, {
        message: "",
        errors: undefined,
        fieldValues: {
            name: "",
        },
    });

    // useEffect(() => {
    //     if (formState.message === "success") {
    //         formRef.current?.reset();
    //     }
    // }, [formState]);

    return (
        <form
            ref={formRef}
            action={formAction}
            // onSubmit={async (e) => {
            //     e.preventDefault();
            //     formAction.;
            // }}
            className="space-y-4"
        >
            <AlertDialogHeader>
                <AlertDialogTitle>Add new Mosque Location</AlertDialogTitle>
            </AlertDialogHeader>
            <div>
                <Input
                    type="text"
                    placeholder="Mosque Name"
                    name="name"
                    id="name"
                    disabled={formState.message === "success"}
                    defaultValue={formState.fieldValues.name}
                    className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none rounded-none rounded-l-md bg-slate-100 dark:bg-slate-600 p-2"
                    required
                />
                <span className="text-left text-sm text-red-400 min-h-4 inline-block">
                    {formState?.errors?.name}
                </span>
            </div>
            <AlertDialogFooter className="">
                <AlertDialogCancel>
                    {formState.message !== "success" ? (
                        "Cancel"
                    ) : (
                        <CheckCircle className="w-6 h-6 shrink-0 text-green-400" />
                    )}
                </AlertDialogCancel>

                {formState.message !== "success" && <SubmitButton />}
            </AlertDialogFooter>
        </form>
    );
}

export default AddPlaceForm;
