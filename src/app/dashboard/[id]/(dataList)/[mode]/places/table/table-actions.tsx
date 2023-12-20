"use client";

import { type Place } from "@/types";
import EditPlaceForm from "@/places-features/edit-place/form";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  deletePlaceAction,
  hidePlaceAction,
  verifyPlaceAction,
} from "../_actions";

type PlaceTableActionsProps = {
  place: Place;
};
function PlaceTableActions({ place }: PlaceTableActionsProps) {
  const { data: Session, status } = useSession();

  return (
    <AlertDialog>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>
          <Link
            prefetch={false}
            href={`/map/?lat=${place.latitude}&lon=${place.longitude}`}
            rel="noopener noreferrer"
            target="_blank"
            className="w-full"
          >
            Show
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={
            Session?.user.role === "USER" ||
            (place.verified && Session?.user.role !== "OWNER")
          }
          onClick={() =>
            verifyPlaceAction({
              placeId: place.id,
              userId: Session?.user.id || "",
              placeVerifiedStatus: place.verified,
            })
          }
          className="cursor-pointer"
        >
          {place.verified ? "Un-Verify" : "Verify"}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={Session?.user.role === "USER"}
          onClick={() =>
            deletePlaceAction({
              placeId: place.id,
              userId: Session?.user.id || "",
              placeDeleteStatus: place.deleted,
            })
          }
          className="cursor-pointer"
        >
          {place.deleted ? "Restore" : "Delete"}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={Session?.user.role === "USER"}
          onClick={() =>
            hidePlaceAction({
              placeId: place.id,
              userId: Session?.user.id || "",
              placeHiddenStatus: place.hidden,
            })
          }
          className="cursor-pointer"
        >
          {place.hidden ? "Un-Hide" : "Hide"}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <AlertDialogTrigger className="cursor-pointer w-full text-left">
            Edit
          </AlertDialogTrigger>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <AlertDialogContent>
        <EditPlaceForm
          place={place}
          userId={Session?.user.id}
          userRole={Session?.user.role}
          userReputation={Session?.user.userReputation}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PlaceTableActions;
