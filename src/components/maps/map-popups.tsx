"use client";
import { Edit } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "../ui/alert-dialog";
import EditPlaceForm from "../forms/edit-place-form";
import { useSession } from "next-auth/react";
import { Place } from "@/schema/modelSchema";

type PlaceMarkPopUpProps = {
	place: Place;
};
export function PlaceMarkPopUp({ place }: PlaceMarkPopUpProps) {
	const { data: Session, status } = useSession();

	return (
		<div className="flex justify-between items-center gap-x-2">
			<span className="font-medium text-lg">{place.arName || place.enName || place.name}</span>

			{status === "authenticated" && (
				<AlertDialog>
					{(Session.user.role === "ADMIN" ||
						Session.user.role === "OWNER" ||
						(Session.user.role === "USER" &&
							Session.user.reputation !== "FAKE" &&
							place.verified === false &&
							place.createdById === Session.user.id)) && (
						<AlertDialogTrigger>
							<Edit className="w-6 h-6 shrink-0" />
						</AlertDialogTrigger>
					)}
					<AlertDialogContent>
						<EditPlaceForm place={place} />
					</AlertDialogContent>
				</AlertDialog>
			)}
		</div>
	);
}
