import { MapPinned, ShieldClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NominatedPlace, SearchStatus } from "./validations";

type AddressesListProps = {
  suggestions: NominatedPlace[];
  searchStatus: SearchStatus;
  suggestionsListOpen: boolean;
  closeHandler: () => void;
  handleLocationSelection: (selected: NominatedPlace) => void;
  errorMessage: string;
};

function AddressesList({
  searchStatus,
  errorMessage,
  suggestions,
  suggestionsListOpen,
  closeHandler,
  handleLocationSelection,
}: AddressesListProps) {
  return (
    <aside
      className={`${
        suggestionsListOpen ? "block" : "hidden"
      }    md:max-h-full max-h-60 overflow-y-auto`}
    >
      <h2 className="flex gap-2 items-center justify-between py-2 px-4">
        <p className="block flex-1 font-medium text-xl">Search Results</p>
        <Button variant={"ghost"} size={"icon"} onClick={closeHandler}>
          <ShieldClose className="shrink-0" />
        </Button>
      </h2>
      <p className="min-h-4 px-4 text-destructive">{errorMessage}</p>

      {searchStatus === "pending" && (
        <div className="space-y-2">
          {[...new Array(10)].map((_, idx) => (
            <Skeleton key={idx} className="h-4 w-full" />
          ))}
        </div>
      )}
      <ul className="grid grid-cols-1  gap-4 w-full justify-start overflow-hidden ">
        {suggestions.map((suggest) => (
          <li
            key={suggest.osm_id}
            className="cursor-pointer"
            onClick={() => {
              handleLocationSelection(suggest);
            }}
          >
            <h4 className="flex gap-2 items-center justify-start px-4 pb-4 ">
              <MapPinned className="w-6 h-6 shrink-0" />
              <div className="block pl-1 max-w-md md:max-w-xs whitespace-nowrap overflow-hidden text-ellipsis pr-2">
                {suggest.display_name}
              </div>
            </h4>
            <div className="flex-grow border-t border-gray-400 "></div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default AddressesList;
