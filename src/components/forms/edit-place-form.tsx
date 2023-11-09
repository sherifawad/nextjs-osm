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
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { CheckCircle, LoaderIcon } from "lucide-react";
import { Place } from "@prisma/client";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditPlaceSchema } from "@/lib/validations";
import { z } from "zod";

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
    const { data: Session, status } = useSession();

    const [formState, formAction] = useFormState(updateMosqueLocation, {
        message: "",
        errors: undefined,
        fieldValues: place,
    });
    const formRef = useRef<HTMLFormElement>(null);
    const [hidden, setHidden] = useState(formState.fieldValues.hidden);
    const [deleted, setDeleted] = useState(formState.fieldValues.deleted);
    const [verified, setVerified] = useState(formState.fieldValues.verified);
    const handleSubmitAction = async (e: SyntheticEvent) => {
        // setErrorMessage("");
        // setSearchStatus("pending");
        // setSuggestionsListOpen(true);
        // setSuggestions([]);

        e.preventDefault();

        const target = e.target as typeof e.target & {
            latitude: { value: number };
        };
    };

    // useEffect(() => {
    //     if (formState.message === "success") {
    //         formRef.current?.reset();
    //     }
    // }, [formState]);

    return (
        <form
            ref={formRef}
            action={formAction}
            // onSubmit={handleSubmitAction}
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
            <div className="flex-1 flex flex-col items-center py-2 w-full xs:w-auto">
                <Input
                    type="text"
                    placeholder="Mosque Name"
                    name="name"
                    disabled={
                        formState.message === "success" ||
                        (!place.verified &&
                            Session?.user.role === "USER" &&
                            (Session?.user.reputation === "FAKE" ||
                                Session?.user.id !== place.createdById))
                    }
                    defaultValue={formState.fieldValues.name}
                    required
                    className=" min-w-[10rem]  border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none rounded-none rounded-l-md bg-slate-100 dark:bg-slate-600 p-2"
                />
                <span className="text-left text-sm text-red-400 min-h-4 inline-block">
                    {formState?.errors?.name}
                </span>
            </div>
            {Session?.user.role !== "USER" && (
                <div className="flex  justify-around gap-x-2 gap-y-8 pb-4 flex-wrap">
                    <div
                        className={`flex items-center space-x-2 ${
                            verified ? "text-green-600" : ""
                        }`}
                    >
                        <Checkbox
                            checked={verified}
                            onCheckedChange={() => setVerified(!verified)}
                            id="verified"
                            name="verified"
                            disabled={
                                formState.message === "success" ||
                                (place.verified &&
                                    Session?.user.role !== "OWNER")
                            }
                            defaultChecked={formState.fieldValues.verified}
                            className={`${
                                verified
                                    ? "data-[state=checked]:bg-secondary data-[state=checked]:text-text-green-600"
                                    : ""
                            }`}
                        />
                        <Label className="" htmlFor="verified">
                            Verified
                        </Label>
                    </div>
                    <div
                        className={`flex items-center space-x-2 ${
                            hidden ? "opacity-50" : "opacity-100"
                        }`}
                    >
                        <Checkbox
                            checked={hidden}
                            onCheckedChange={() => setHidden(!hidden)}
                            id="hidden"
                            name="hidden"
                            disabled={formState.message === "success"}
                            defaultChecked={formState.fieldValues.hidden}
                        />
                        <Label className="" htmlFor="hidden">
                            Hidden
                        </Label>
                    </div>
                    {Session?.user.role === "OWNER" && (
                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={deleted}
                                onCheckedChange={() => setDeleted(!deleted)}
                                id="deleted"
                                name="deleted"
                                disabled={formState.message === "success"}
                                defaultChecked={formState.fieldValues.deleted}
                            />
                            <Label
                                htmlFor="deleted"
                                className={` ${
                                    deleted
                                        ? "text-destructive font-medium"
                                        : "text-destructive/50 font-light"
                                }`}
                            >
                                Deleted
                            </Label>
                        </div>
                    )}
                </div>
            )}
            <div className="flex justify-between xs:items-center gap-x-2 flex-col  xs:flex-row ">
                <div className="flex-1">
                    <Input
                        type="number"
                        placeholder="Mosque Latitude"
                        name={
                            formState.message === "success" ||
                            (place.verified &&
                                Session?.user.role !== "OWNER") ||
                            (!place.verified &&
                                Session?.user.role === "USER" &&
                                Session?.user.id !== place.createdById)
                                ? "aa"
                                : "latitude"
                        }
                        disabled={
                            formState.message === "success" ||
                            (place.verified &&
                                Session?.user.role !== "OWNER") ||
                            (!place.verified &&
                                Session?.user.role === "USER" &&
                                Session?.user.id !== place.createdById)
                        }
                        defaultValue={formState.fieldValues.latitude}
                        className=" border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none rounded-none rounded-l-md bg-slate-100 dark:bg-slate-600 p-2"
                        required
                    />
                    {formState.message === "success" ||
                        (place.verified && Session?.user.role !== "OWNER") ||
                        (!place.verified &&
                        Session?.user.role === "USER" &&
                        Session?.user.id !== place.createdById ? (
                            <Input
                                type="number"
                                placeholder="Mosque Latitude"
                                name="latitude"
                                defaultValue={formState.fieldValues.latitude}
                                className="hidden w-0 h-0"
                                required
                            />
                        ) : null)}
                    <span className="text-left text-sm text-red-400 min-h-4 inline-block">
                        {formState?.errors?.latitude}
                    </span>
                </div>
                <div className="flex-1">
                    <Input
                        type="number"
                        placeholder="Mosque Longitude"
                        name="longitude"
                        disabled={
                            formState.message === "success" ||
                            (place.verified &&
                                Session?.user.role !== "OWNER") ||
                            (!place.verified &&
                                Session?.user.role === "USER" &&
                                Session?.user.id !== place.createdById)
                        }
                        defaultValue={formState.fieldValues.longitude}
                        className="  border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none rounded-none rounded-l-md bg-slate-100 dark:bg-slate-600 p-2"
                    />
                    <span className="text-left text-sm text-red-400 min-h-4 inline-block">
                        {formState?.errors?.longitude}
                    </span>
                </div>
            </div>
            <div className="flex justify-between xs:items-center gap-x-2 flex-col  xs:flex-row">
                <div className="flex-1">
                    <Input
                        type="text"
                        placeholder=" اسم المسجد بالعربي"
                        name="arName"
                        disabled={
                            formState.message === "success" ||
                            (!place.verified &&
                                Session?.user.role === "USER" &&
                                (Session?.user.reputation === "FAKE" ||
                                    Session?.user.id !== place.createdById))
                        }
                        defaultValue={formState.fieldValues.arName || ""}
                        className="text-right border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none rounded-none rounded-l-md bg-slate-100 dark:bg-slate-600 p-2"
                    />
                    <span className="text-left text-sm text-red-400 min-h-4 inline-block">
                        {formState?.errors?.arName}
                    </span>
                </div>
                <div className="flex-1">
                    <Input
                        type="text"
                        placeholder="Mosque Name in English"
                        name="enName"
                        disabled={
                            formState.message === "success" ||
                            (!place.verified &&
                                Session?.user.role === "USER" &&
                                (Session?.user.reputation === "FAKE" ||
                                    Session?.user.id !== place.createdById))
                        }
                        defaultValue={formState.fieldValues.enName || ""}
                        className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none rounded-none rounded-l-md bg-slate-100 dark:bg-slate-600 p-2"
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

const EditForm = ({ place }: EditPlaceFormProps) => {
    const form = useForm<z.infer<typeof EditPlaceSchema>>({
        resolver: zodResolver(EditPlaceSchema),
        defaultValues: place,
    });

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = form;

    const [successfulSubmit, setSuccessfulSubmit] = useState(false);

    const onSubmit = async (values: unknown) => {
        const validateFrom = EditPlaceSchema.safeParse(values);

        if (!validateFrom.success) return;

        const actionResult = await updateMosqueLocation(validateFrom.data);

        if (responseData.errors) {
            const errors = responseData.errors;

            if (errors.name) {
                form.setError("name", {
                    type: "server",
                    message: errors.name,
                });
            } else if (errors.email) {
                form.setError("email", {
                    type: "server",
                    message: errors.email,
                });
            } else if (errors.phone) {
                form.setError("phone", {
                    type: "server",
                    message: errors.phone,
                });
            } else if (errors.subject) {
                form.setError("subject", {
                    type: "server",
                    message: errors.subject,
                });
            } else if (errors.message) {
                form.setError("message", {
                    type: "server",
                    message: errors.message,
                });
            } else {
                alert("Something went wrong!");
            }
        } else {
            setSuccessfulSubmit(true);
            reset();
            // timer;
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <input
                    className="hidden h-0 w-0"
                    name="id"
                    type="text"
                    defaultValue={defaultValues.id}
                    required
                />
                <div className="space-y-2">
                    <FormField
                        control={control}
                        name=""
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mosque Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Mosque Name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Enter your password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button className="w-full mt-6" type="submit">
                    Sign in
                </Button>
            </form>
        </Form>
    );
};

export default EditPlaceForm;
