"use client";
import { Edit } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "../ui/alert-dialog";
import EditPlaceForm from "../forms/edit-place-form";
import { useSession } from "next-auth/react";
import { Place } from "@/schema/modelSchema";
import PlaceRate from "../place-rate";
import { DataBasePlace } from "@/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import usePlace from "@/hooks/usePlace";
import { Dispatch, SetStateAction, useMemo } from "react";

type PlaceMarkPopUpProps = {
	place: DataBasePlace;
};
export function PlaceMarkPopUp({ place }: PlaceMarkPopUpProps) {
	const { data: Session, status } = useSession();

	return (
		<>
			{status === "authenticated" ? (
				<AlertDialog>
					{Session.user.role === "ADMIN" ||
					Session.user.role === "OWNER" ||
					(Session.user.role === "USER" &&
						Session.user.userReputation > 0 &&
						place.verified === false &&
						place.createdById === Session.user.id) ? (
						<AlertDialogTrigger className="flex  items-center justify-center gap-x-2 w-full">
							<span className="font-bold text-lg mt-1">{place.arName || place.enName || place.name}</span>
							<Edit className="w-4 h-4 shrink-0" />
						</AlertDialogTrigger>
					) : (
						<span className="font-bold text-lg text-center w-full block">
							{place.arName || place.enName || place.name}
						</span>
					)}
					<AlertDialogContent>
						<EditPlaceForm place={place} />
					</AlertDialogContent>
				</AlertDialog>
			) : (
				<span className="font-bold text-lg text-center w-full block">{place.arName || place.enName || place.name}</span>
			)}
			<PlaceRate />
		</>
	);
}
