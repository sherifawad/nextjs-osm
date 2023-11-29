"use client";

import { type Place } from "@/types";
import EditPlaceForm from "@/edit-place/form";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/ui/alert-dialog";
import { DropdownMenuContent, DropdownMenuItem } from "@/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { deletePlaceAction, hidePlaceAction, verifyPlaceAction } from "./actions";
import usePlace from "@/hooks/usePlace";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

type PlaceTableActionsProps = {
	place: Place;
};
function PlaceTableActions({ place }: PlaceTableActionsProps) {
	const { data: Session, status } = useSession();
	const router = useRouter();
	const { latitude, longitude, id } = place;
	const { setLocationData } = usePlace();

	const showBtnHandler = useCallback(
		({ latitude, longitude }: { latitude: number; longitude: number }) => {
			setLocationData({ location: { latitude, longitude } });
			const newWindow = window.open(`/leafletMap?lat=${latitude}&lon=${longitude}`, "_blank", "noopener,noreferrer");
			if (newWindow) newWindow.opener = null;
		},
		[setLocationData]
	);

	return (
		<DropdownMenuContent align="end" className="w-[160px]">
			<DropdownMenuItem onClick={() => showBtnHandler({ latitude: place.latitude, longitude: place.longitude })}>
				<Link
					prefetch={false}
					href={`/leafletMap?lat=${latitude}&lon=${longitude}`}
					rel="noopener noreferrer"
					target="_blank"
					className="w-full"
				>
					Show
				</Link>
			</DropdownMenuItem>
			<DropdownMenuItem
				onClick={() =>
					verifyPlaceAction({ placeId: place.id, userId: Session?.user.id || "", placeVerifiedStatus: place.verified })
				}
				className="cursor-pointer"
			>
				Verify
			</DropdownMenuItem>
			<DropdownMenuItem
				onClick={() =>
					deletePlaceAction({ placeId: place.id, userId: Session?.user.id || "", placeDeleteStatus: place.deleted })
				}
				className="cursor-pointer"
			>
				Delete
			</DropdownMenuItem>
			<DropdownMenuItem
				onClick={() =>
					hidePlaceAction({ placeId: place.id, userId: Session?.user.id || "", placeHiddenStatus: place.hidden })
				}
				className="cursor-pointer"
			>
				Hidden
			</DropdownMenuItem>
			<DropdownMenuItem>
				<AlertDialog>
					<AlertDialogTrigger className="cursor-pointer w-full ">Edit</AlertDialogTrigger>
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
