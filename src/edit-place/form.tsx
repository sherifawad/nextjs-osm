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
import { updatePlaceLocation } from "./actions";
import { RoleType, TEditPlaceForm, editPlaceFormSchema } from "./validation";
import { Checkbox } from "@/ui/checkbox";
import { Switch } from "@/ui/switch";
import { type Place } from "@/database";

type EditPlaceFormProps = {
	place: Place;
	userRole?: RoleType;
	userId?: string;
	userReputation?: number;
};

const EditPlaceForm = ({ place, userRole, userId, userReputation }: EditPlaceFormProps) => {
	const form = useForm<TEditPlaceForm>({
		resolver: zodResolver(editPlaceFormSchema),
		defaultValues: place,
	});

	const {
		handleSubmit,
		formState: { isDirty, isSubmitting, defaultValues },
		control,
	} = form;
	const [serverError, setServerError] = useState("");
	const [successfulSubmit, setSuccessfulSubmit] = useState(false);

	const onSubmit = async (values: unknown) => {
		setServerError("");
		setSuccessfulSubmit(false);
		setServerError("");
		const validateFrom = editPlaceFormSchema.safeParse(values);

		if (!validateFrom.success) return;

		const actionResult = await updatePlaceLocation(validateFrom.data);

		if (actionResult.status === "error") {
			const errors = actionResult.errors;

			if (errors.name) {
				form.setError("name", {
					type: "server",
					message: errors.name,
				});
			} else if (errors.arName) {
				form.setError("arName", {
					type: "server",
					message: errors.arName,
				});
			} else if (errors.enName) {
				form.setError("enName", {
					type: "server",
					message: errors.enName,
				});
			} else if (errors.image) {
				form.setError("image", {
					type: "server",
					message: errors.image,
				});
			} else if (errors.latitude) {
				form.setError("latitude", {
					type: "server",
					message: errors.latitude,
				});
			} else if (errors.longitude) {
				form.setError("longitude", {
					type: "server",
					message: errors.longitude,
				});
			} else if (errors.deleted) {
				form.setError("deleted", {
					type: "server",
					message: errors.deleted,
				});
			} else if (errors.hidden) {
				form.setError("hidden", {
					type: "server",
					message: errors.hidden,
				});
			} else if (errors.verified) {
				form.setError("verified", {
					type: "server",
					message: errors.verified,
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

	if (!userId || !userRole || !userReputation) return null;

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8 bg-background">
				<AlertDialogHeader>
					<AlertDialogTitle>Edit Mosque PlaceLocation</AlertDialogTitle>
					<p className="font-medium min-h-4 text-destructive">{serverError}</p>
				</AlertDialogHeader>
				<input className="hidden w-0 h-0" name="id" type="text" defaultValue={defaultValues?.id} required />
				<div className="space-y-2">
					<FormField
						control={control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Mosque Name</FormLabel>
								<FormControl>
									<Input
										placeholder="Mosque Name"
										{...field}
										disabled={
											successfulSubmit ||
											(!defaultValues?.verified &&
												userRole === "USER" &&
												(userReputation < 1 || userId !== place?.createdById))
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div
						className={` ${
							userRole === "USER" ? "hidden" : "flex"
						} items-center  justify-around gap-x-4 gap-y-8 flex-wrap`}
					>
						<FormField
							control={control}
							name="verified"
							render={({ field: { value, onChange, ...fields } }) => (
								<FormItem className="flex items-center gap-x-3 ">
									<FormLabel className={`mt-2 ${value ? "text-green-600" : ""}`}>Verified</FormLabel>
									<FormControl>
										<Checkbox
											{...fields}
											checked={value}
											onCheckedChange={onChange}
											className={`${
												value ? "data-[state=checked]:bg-secondary data-[state=checked]:text-green-600" : ""
											}`}
											disabled={successfulSubmit || (place.verified && userRole !== "OWNER")}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name="hidden"
							render={({ field: { value, onChange, ...fields } }) => (
								<FormItem
									className={`items-center  gap-x-3  ${userRole !== "USER" ? "flex " : "hidden"} ${
										value ? "opacity-50" : "opacity-100"
									}`}
								>
									<FormLabel className="mt-2">Hidden</FormLabel>
									<FormControl>
										<Checkbox
											{...fields}
											checked={value}
											onCheckedChange={onChange}
											disabled={successfulSubmit || userRole === "USER"}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="deleted"
							render={({ field: { value, onChange, ...fields } }) => (
								<FormItem
									className={` ${value ? "text-destructive font-medium" : "text-destructive/50 font-light"} ${
										userRole !== "OWNER" ? "hidden" : "block"
									}`}
								>
									<FormControl className="mx-2 mt-2 ">
										<Switch {...fields} checked={value} onCheckedChange={onChange} disabled={successfulSubmit} />
									</FormControl>
									<FormLabel className="mb-5">deleted</FormLabel>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid grid-cols-1 grid-rows-2 gap-4 xs:grid-cols-2 xs:grid-rows-1">
						<FormField
							control={control}
							name="latitude"
							render={({ field }) => (
								<FormItem>
									<FormLabel>latitude</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											className="p-2 border-none rounded-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-l-md bg-slate-100 dark:bg-slate-600"
											disabled={
												successfulSubmit ||
												(defaultValues?.verified && userRole !== "OWNER") ||
												(!defaultValues?.verified && userRole === "USER")
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name="longitude"
							render={({ field }) => (
								<FormItem>
									<FormLabel>longitude</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											className="p-2 border-none rounded-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-l-md bg-slate-100 dark:bg-slate-600"
											disabled={
												successfulSubmit ||
												(defaultValues?.verified && userRole !== "OWNER") ||
												(!defaultValues?.verified && userRole === "USER")
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid grid-cols-1 grid-rows-2 gap-4 xs:grid-cols-2 xs:grid-rows-1">
						<FormField
							control={control}
							name="arName"
							render={({ field: { value, ...fields } }) => (
								<FormItem className="flex-1">
									<FormLabel>اسم المسجد بالعربي</FormLabel>
									<FormControl>
										<Input
											{...fields}
											value={value ?? ""}
											type="text"
											className="p-2 text-right border-none rounded-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-l-md bg-slate-100 dark:bg-slate-600"
											disabled={
												successfulSubmit ||
												(!defaultValues?.verified &&
													userRole === "USER" &&
													(userReputation < 1 || userId !== place?.createdById))
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name="enName"
							render={({ field: { value, ...fields } }) => (
								<FormItem className="flex-1">
									<FormLabel>Mosque Name in English</FormLabel>
									<FormControl>
										<Input
											{...fields}
											value={value ?? ""}
											type="text"
											className="p-2 border-none rounded-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-l-md bg-slate-100 dark:bg-slate-600"
											disabled={
												successfulSubmit ||
												(!defaultValues?.verified &&
													userRole === "USER" &&
													(userReputation < 1 || userId !== place?.createdById))
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
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

export default EditPlaceForm;
