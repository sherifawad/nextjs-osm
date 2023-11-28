"use client";

import { type Place } from "@/types";
import EditPlaceForm from "@/edit-place/form";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/ui/alert-dialog";
import { DropdownMenuContent, DropdownMenuItem } from "@/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { deletePlaceAction, hidePlaceAction, verifyPlaceAction } from "./actions";

type PlaceTableActionsProps = {
	place: Place;
};
function PlaceTableActions({ place }: PlaceTableActionsProps) {
	const { data: Session, status } = useSession();

	return (
		<DropdownMenuContent align="end" className="w-[160px]">
			<DropdownMenuItem>
				<Link
					prefetch={false}
					href={`/leafletMap?lat=${place.latitude}&lon=${place.longitude}`}
					rel="noopener noreferrer"
					target="_blank"
				>
					Show
				</Link>
			</DropdownMenuItem>
			<DropdownMenuItem
				onClick={() =>
					verifyPlaceAction({ placeId: place.id, userId: Session?.user.id || "", placeVerifiedStatus: place.verified })
				}
			>
				Verify
			</DropdownMenuItem>
			<DropdownMenuItem
				onClick={() =>
					deletePlaceAction({ placeId: place.id, userId: Session?.user.id || "", placeDeleteStatus: place.deleted })
				}
			>
				Delete
			</DropdownMenuItem>
			<DropdownMenuItem
				onClick={() =>
					hidePlaceAction({ placeId: place.id, userId: Session?.user.id || "", placeHiddenStatus: place.hidden })
				}
			>
				Hidden
			</DropdownMenuItem>
			<DropdownMenuItem>
				<AlertDialog>
					<AlertDialogTrigger>Edit</AlertDialogTrigger>
					<AlertDialogContent>
						<EditPlaceForm
							place={place}
							userId={Session?.user.id}
							userRole={Session?.user.role}
							userReputation={Session?.user.userReputation}
						/>
					</AlertDialogContent>
				</AlertDialog>
			</DropdownMenuItem>
		</DropdownMenuContent>
	);
}

export default PlaceTableActions;
