import { SearchStatus, Tominatim } from "@/lib/types";
import { MapPinned, ShieldClose } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

type SearchSideBarProps = {
	suggestions: Tominatim[];
	searchKey?: string;
	searchStatus: SearchStatus;
	suggestionsListOpen: boolean;
	closeHandler: () => void;
	handleLocationSelection: (selected: Tominatim) => void;
	errorMessage: string;
};

function SearchSideBar({
	searchStatus,
	errorMessage,
	suggestions,
	searchKey,
	suggestionsListOpen,
	closeHandler,
	handleLocationSelection,
}: SearchSideBarProps) {
	return (
		<aside className={`${suggestionsListOpen ? "block" : "hidden"}    md:max-h-full max-h-60 overflow-y-auto`}>
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

export default SearchSideBar;
