import { addMosqueLocation } from "@/app/_actions";
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";

function AddPlaceForm() {
    return (
        <form action={addMosqueLocation}>
            <AlertDialogHeader>
                <AlertDialogTitle>Add new Mosque Location</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-4">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit">Continue</AlertDialogAction>
            </AlertDialogFooter>
        </form>
    );
}

export default AddPlaceForm;
