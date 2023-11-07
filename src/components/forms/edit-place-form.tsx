"use client";

import { addMosqueLocation, updateMosqueLocation } from "@/app/_actions";
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
import { Place } from "@prisma/client";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

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

type EditPlaceFormProps = {
    place: Place;
};

function EditPlaceForm({ place }: EditPlaceFormProps) {
    const formRef = useRef<HTMLFormElement>(null);

    const [formState, formAction] = useFormState(updateMosqueLocation, {
        message: "",
        errors: undefined,
        fieldValues: place,
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
                <AlertDialogTitle>Edit Mosque Location</AlertDialogTitle>
            </AlertDialogHeader>
            <input
                className="hidden h-0 w-0"
                name="id"
                type="text"
                defaultValue={formState.fieldValues.id}
                required
            />
            <div className="flex flex-col xs:flex-row justify-between flex-wrap gap-x-2 ">
                <div className="flex-1 flex flex-col items-center py-2 w-full xs:w-auto">
                    <Input
                        type="text"
                        placeholder="Mosque Name"
                        name="name"
                        disabled={formState.message === "success"}
                        defaultValue={formState.fieldValues.name}
                        required
                        className=" min-w-[10rem]  border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none rounded-none rounded-l-md bg-slate-100 dark:bg-slate-600 p-2"
                    />
                    <span className="text-left text-sm text-red-400 min-h-4 inline-block">
                        {formState?.errors?.name}
                    </span>
                </div>
                <div className="flex items-center space-x-2 ">
                    <Checkbox
                        id="verified"
                        name="verified"
                        disabled={formState.message === "success"}
                        defaultChecked={formState.fieldValues.verified}
                    />
                    <Label className="" htmlFor="verified">
                        Verified
                    </Label>
                </div>
            </div>
            <div className="flex justify-between items-center gap-x-2 flex-wrap ">
                <div className="w-full xs:w-auto">
                    <Input
                        type="number"
                        placeholder="Mosque Latitude"
                        name="Latitude"
                        disabled={formState.message === "success"}
                        defaultValue={formState.fieldValues.latitude}
                        className=" min-w-[10rem] border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none rounded-none rounded-l-md bg-slate-100 dark:bg-slate-600 p-2"
                        required
                    />
                    <span className="text-left text-sm text-red-400 min-h-4 inline-block">
                        {formState?.errors?.latitude}
                    </span>
                </div>
                <div className="w-full xs:w-auto">
                    <Input
                        type="number"
                        placeholder="Mosque Longitude"
                        name="Longitude"
                        disabled={formState.message === "success"}
                        defaultValue={formState.fieldValues.longitude}
                        className=" min-w-[10rem] border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none rounded-none rounded-l-md bg-slate-100 dark:bg-slate-600 p-2"
                    />
                    <span className="text-left text-sm text-red-400 min-h-4 inline-block">
                        {formState?.errors?.longitude}
                    </span>
                </div>
            </div>
            <div className="flex justify-between items-center gap-x-2 flex-wrap">
                <div className="w-full xs:w-auto">
                    <Input
                        type="text"
                        placeholder=" اسم المسجد بالعربي"
                        name="arName"
                        disabled={formState.message === "success"}
                        defaultValue={formState.fieldValues.arName || ""}
                        className=" min-w-[10rem] text-right border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none rounded-none rounded-l-md bg-slate-100 dark:bg-slate-600 p-2"
                    />
                    <span className="text-left text-sm text-red-400 min-h-4 inline-block">
                        {formState?.errors?.arName}
                    </span>
                </div>
                <div className="w-full xs:w-auto">
                    <Input
                        type="text"
                        placeholder="Mosque Name in English"
                        name="enName"
                        disabled={formState.message === "success"}
                        defaultValue={formState.fieldValues.enName || ""}
                        className=" min-w-[10rem] border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none rounded-none rounded-l-md bg-slate-100 dark:bg-slate-600 p-2"
                    />
                    <span className="text-left text-sm text-red-400 min-h-4 inline-block">
                        {formState?.errors?.enName}
                    </span>
                </div>
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

export default EditPlaceForm;
