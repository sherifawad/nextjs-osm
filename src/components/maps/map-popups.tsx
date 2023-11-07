import { Place } from "@/lib/validations/generated-zod-schemas";
import { Edit } from "lucide-react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import EditPlaceForm from "../forms/edit-place-form";

type PlaceMarkPopUpProps = {
    place: Place;
};
export function PlaceMarkPopUp({ place }: PlaceMarkPopUpProps) {
    return (
        <div className="flex justify-between items-center gap-x-2">
            <span className="font-medium text-lg">
                {place.arName || place.enName || place.name}
            </span>
            <AlertDialog>
                <AlertDialogTrigger>
                    <Edit className="w-6 h-6 shrink-0" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <EditPlaceForm place={place} />
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
