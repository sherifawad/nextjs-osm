"use client";

import {
	AlertDialogCancel,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, LoaderIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { addPlaceLocation } from "./actions";
import { TAddPlaceForm, addPlaceFormSchema } from "./validation";

const AddPlaceForm = () => {
	const form = useForm<TAddPlaceForm>({
		resolver: zodResolver(addPlaceFormSchema),
		defaultValues: {
			name: "",
		},
	});

	const {
		handleSubmit,
		formState: { isDirty, isSubmitting },
		control,
	} = form;
	const [serverError, setServerError] = useState("");
	const [successfulSubmit, setSuccessfulSubmit] = useState(false);

	const onSubmit = async (values: unknown) => {
		setServerError("");
		setSuccessfulSubmit(false);
		const validateFrom = addPlaceFormSchema.safeParse(values);

		if (!validateFrom.success) {
			console.log(
				"🚀 ~ file: form.tsx:53 ~ onSubmit ~ validateFromErrors:",
				JSON.stringify(validateFrom.error, null, 2)
			);
			return;
		}

		const actionResult = await addPlaceLocation(validateFrom.data);

		if (actionResult.status === "error") {
			const errors = actionResult.errors;

			if (errors.name) {
				form.setError("name", {
					type: "server",
					message: errors.name,
				});
			} else if (errors.serverError) {
				setServerError(errors.serverError);
			} else {
				setServerError("Unknown Error");
			}
		} else {
			setSuccessfulSubmit(true);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="w-full  space-y-8 bg-background">
				<AlertDialogHeader>
					<AlertDialogTitle>Add PlaceLocation</AlertDialogTitle>
					<p className="font-medium min-h-4 text-destructive">{serverError}</p>
				</AlertDialogHeader>
				<FormField
					control={control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mosque Name</FormLabel>
							<FormControl>
								<Input placeholder="Mosque Name" {...field} disabled={successfulSubmit} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<AlertDialogFooter className="">
					{successfulSubmit ? (
						<AlertDialogAction>
							<CheckCircle className="w-6 h-6 text-green-400 shrink-0 mx-auto" />
						</AlertDialogAction>
					) : (
						<>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<Button disabled={!isDirty} type="submit">
								{isSubmitting ? <LoaderIcon className="w-6 h-6 shrink-0 animate-spin" /> : "Submit"}
							</Button>
						</>
					)}
				</AlertDialogFooter>
			</form>
		</Form>
	);
};

export default AddPlaceForm;
