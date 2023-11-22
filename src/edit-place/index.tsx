"use client";

import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/ui/alert-dialog";
import { useSession } from "next-auth/react";
import React from "react";
import { Edit } from "lucide-react";
import EditPlaceForm from "./form";
import { Place } from "@/database/place";

type EditSelectedPlaceProps = {
	place: Place;
	onDialogOpen?: () => Promise<void>;
};

function EditSelectedPlace({ place, onDialogOpen = () => new Promise(() => undefined) }: EditSelectedPlaceProps) {
	const { data: Session, status: userStatus } = useSession();

	return (
		<div className="text-center">
			{userStatus === "authenticated" ? (
				<AlertDialog>
					{Session.user.role === "ADMIN" ||
					Session.user.role === "OWNER" ||
					(Session.user.role === "USER" &&
						Session.user.userReputation > 0 &&
						place.verified === false &&
						place.createdById === Session.user.id) ? (
						<AlertDialogTrigger onClick={onDialogOpen} className="flex  items-center justify-center gap-x-2 w-full">
							<span className="font-bold text-lg mt-1">{place.arName || place.enName || place.name}</span>
							<Edit className="w-4 h-4 shrink-0" />
						</AlertDialogTrigger>
					) : (
						<span className="font-bold text-lg text-center w-full block">
							{place.arName || place.enName || place.name}
						</span>
					)}
					<AlertDialogContent>
						<EditPlaceForm
							place={place}
							userId={Session.user.id}
							userRole={Session.user.role}
							userReputation={Session.user.userReputation}
						/>
					</AlertDialogContent>
				</AlertDialog>
			) : (
				<span className="font-bold text-lg text-center w-full block">{place.arName || place.enName || place.name}</span>
			)}
		</div>
	);
}

export default EditSelectedPlace;
