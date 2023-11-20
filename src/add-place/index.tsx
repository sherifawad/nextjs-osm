"use client";

import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/ui/alert-dialog";
import { Button } from "@/ui/button";
import { signIn, useSession } from "next-auth/react";
import React from "react";
import AddPlaceForm from "./form";

type AddNewPlaceProps = {
	latitude: number;
	longitude: number;
	onDialogOpen?: () => Promise<void>;
};

function AddNewPlace({ latitude, longitude, onDialogOpen = () => new Promise(() => undefined) }: AddNewPlaceProps) {
	const { data: Session, status: userStatus } = useSession();

	return (
		<div className="text-center">
			<p>
				Latitude: <span>{latitude}</span>
			</p>
			<p>
				Longitude: <span>{longitude}</span>
			</p>
			{userStatus === "authenticated" && Session?.user.userReputation > 0 ? (
				<AlertDialog>
					<AlertDialogTrigger>
						<p
							className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
							onClick={onDialogOpen}
						>
							Add new Mosque PlaceLocation
						</p>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AddPlaceForm />
					</AlertDialogContent>
				</AlertDialog>
			) : (
				<Button onClick={() => signIn()}>Login to Add Mosque</Button>
			)}
		</div>
	);
}

export default AddNewPlace;
