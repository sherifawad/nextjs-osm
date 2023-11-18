"use client";

import { addMosqueLocation } from "@/app/_actions";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/ui/alert-dialog";
import { Input } from "../ui/input";
import { useFormStatus } from "react-dom";
import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { CheckCircle, LoaderIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";

const SubmitButton = () => {
	const { pending } = useFormStatus();

	return (
		<Button disabled={pending} type="submit">
			{pending ? <LoaderIcon className="w-6 h-6 shrink-0 animate-spin" /> : "Submit"}
		</Button>
	);
};

type AddPlaceFormProps = {
	triggerBtnHandler: () => void;
};

function AddPlaceForm({ triggerBtnHandler }: AddPlaceFormProps) {
	const { data: Session, status } = useSession();

	const formRef = useRef<HTMLFormElement>(null);

	const [formState, formAction] = useFormState(addMosqueLocation, {
		message: "",
		errors: undefined,
		fieldValues: {
			name: "",
		},
	});

	// useEffect(() => {
	// 	if (formState.message === "success") {
	// 		formRef.current?.reset();
	// 	}
	// }, [formState]);

	return (
		<>
			{status === "authenticated" && Session.user.userReputation > 0 ? (
				<AlertDialog>
					<AlertDialogTrigger>
						<p
							className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
							onClick={triggerBtnHandler}
						>
							Add new Mosque PlaceLocation
						</p>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<form
							ref={formRef}
							action={formAction}
							// onSubmit={async (e) => {
							//     e.preventDefault();
							//     formAction.;
							// }}
							className="space-y-4 bg-background"
						>
							<AlertDialogHeader>
								<AlertDialogTitle>Add new Mosque PlaceLocation</AlertDialogTitle>
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
								<span className="text-left text-sm text-red-400 min-h-4 inline-block">{formState?.errors?.name}</span>
							</div>
							<AlertDialogFooter className="">
								<AlertDialogCancel>
									{formState.message !== "success" ? (
										"Cancel"
									) : (
										<CheckCircle className="w-6 h-6 shrink-0 text-green-400" onClick={() => (formState.message = "")} />
									)}
								</AlertDialogCancel>

								{formState.message !== "success" && <SubmitButton />}
							</AlertDialogFooter>
						</form>
					</AlertDialogContent>
				</AlertDialog>
			) : (
				<Button onClick={() => signIn()}>Login to Add Mosque</Button>
			)}
		</>
	);
}

export default AddPlaceForm;
