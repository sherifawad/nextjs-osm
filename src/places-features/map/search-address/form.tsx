import { LocateFixed, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/alert-dialog";

type SearchFormProps = {
  getLocationHandler?: () => void;
  showLocationButton?: boolean;
};

function SearchForm({
  getLocationHandler = () => {},
  showLocationButton = false,
}: SearchFormProps) {
  return (
    <AlertDialog>
      <div className="flex w-full items-center ">
        <Input
          type="search"
          placeholder="Search"
          name="search"
          className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none rounded-none rounded-l-md"
        />
        {showLocationButton && (
          <>
            <Button
              type="button"
              variant={"secondary"}
              size={"default"}
              className="bg-background  hover:bg-background rounded-none hidden md:block"
              onClick={getLocationHandler}
            >
              <LocateFixed className="h-6 w-6 rotate-0 scale-100 transition-all hover:-rotate-90 " />
            </Button>
            <AlertDialogTrigger>
              <Button
                type="button"
                variant={"secondary"}
                size={"default"}
                className="bg-background  hover:bg-background rounded-none block md:hidden"
                onClick={getLocationHandler}
              >
                <LocateFixed className="h-6 w-6 rotate-0 scale-100 transition-all hover:-rotate-90 " />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Enable device location</AlertDialogTitle>
                <AlertDialogDescription>
                  You must enable device location which allow to get device
                  geolocation.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={getLocationHandler}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </>
        )}
        <Button type="submit" className="rounded-l-none">
          <Search />
        </Button>
      </div>
    </AlertDialog>
  );
}

export default SearchForm;
