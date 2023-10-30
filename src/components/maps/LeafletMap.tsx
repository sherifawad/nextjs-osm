"use client";
import { useSearchParams } from "next/navigation";
import React, {
    FormEvent,
    SyntheticEvent,
    useEffect,
    useRef,
    useState,
} from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import z from "zod";
import L from "leaflet";
import { getSuggestions } from "@/app/_actions";
import { Tominatim } from "@/lib/types";
import Link from "next/link";
import SearchForm from "../SearchForm";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import {
    LucideSidebarClose,
    MapPin,
    MapPinned,
    PanelRightClose,
    ShieldClose,
    SidebarClose,
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const icon = L.icon({
    iconUrl: "./pinmap.svg",
    iconSize: [20, 20],
    // iconUrl: MapPin.toString(),
});

// const position = [51.505, -0.09];
const position = {
    lat: 30.786883,
    lng: 30.999614,
};

function ResetCenterView({ lat, lon }: { lon: number; lat: number }) {
    const map = useMap();

    useEffect(() => {
        if (lat && lon) {
            map.setView(L.latLng(lat, lon), map.getZoom(), {
                animate: true,
            });
        }
    }, [map, lat, lon]);

    return null;
}
const data = [
    "gsdlgjlksgjlkjgjsljssglkjgljgjjlskjgkljfgjgkdsjfsdfsgs",
    "gjsgjsdgljlsgjlkjglkjlkjgolnboiijijrenbojojbsoejoiju099fsfsfsfn lkjgolnboiijijrenbojojbsoejoiju0",
    "gkjlkgjklnmnglkskngoijhgnlgn vkmnkjvn",
];

// const getSuggestions = debounce(async (inputValue, setSuggestions) => {
//     try {
//         const params = {
//             q: inputValue,
//             featuretype: "administrative",
//             format: "json",
//             addressdetails: 1,
//             limit: 5,
//             extratags: 1,
//         };
//         const query = new URLSearchParams(params).toString();
//         const response = await fetch(
//             "https://nominatim.openstreetmap.org/search?" + query
//         );
//         const data = await response.json();

//         console.log(data);
//         const formattedSuggestions = data
//             .filter(
//                 (result) =>
//                     ["local_authority", "administrative", "political"].includes(
//                         result.type
//                     ) && result.extratags.wikipedia
//             )
//             .map((result) => {
//                 const wikiname = result.extratags.wikipedia,
//                     wikititle = wikiname && wikiname.split(":")[1];
//                 return {
//                     label: wikititle,
//                     id: result.osm_id,
//                     nominame: result.display_name,
//                 };
//             });

//         setSuggestions(formattedSuggestions);
//     } catch (error) {
//         console.error("Error fetching suggestions:", error);
//     }
// }, 300);

function LeafletMap() {
    // const searchParams = useSearchParams();
    // const location = searchParams.get("location");
    // getSuggestions("tanta");

    const [searchStatus, setSearchStatus] = useState<string | undefined>(
        undefined
    );
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [suggestions, setSuggestions] = useState<Tominatim[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Tominatim>();
    const [suggestionsListOpen, setSuggestionsListOpen] = useState(false);
    const SheetRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (searchStatus === "success") {
            SheetRef.current?.click();
        }
    }, [searchStatus]);

    const handleSubmitAction = async (e: SyntheticEvent) => {
        setErrorMessage("");
        setSearchStatus("pending");
        setSuggestionsListOpen(true);

        e.preventDefault();

        const schema = z.string().min(3);

        const target = e.target as typeof e.target & {
            search: { value: string };
        };

        const validateData = schema.safeParse(target.search.value);
        if (!validateData.success) {
            setSearchStatus("error");
            setErrorMessage(validateData.error.issues[0].message);
            return;
        }
        const suggestions = await getSuggestions(validateData.data);
        if (suggestions === null || suggestions.length < 1) {
            setSearchStatus("error");
            setErrorMessage("could not find suggestions");
            return;
        }
        setSuggestions(suggestions);
        setSearchStatus("success");
        setErrorMessage("");
    };
    return (
        <div className="relative h-full ">
            <div
                className={`md:absolute block ${
                    suggestionsListOpen
                        ? "bottom-0 bg-background shadow-none"
                        : ""
                }  top-0 right-4 md:z-10 w-full md:w-[300px] lg:w-[400px] `}
            >
                <form
                    onSubmit={handleSubmitAction}
                    className="bg-slate-100 dark:bg-slate-600 p-2"
                >
                    {/* <input type="search" placeholder="Search" name="search" />
                    <button type="submit" disabled={searchStatus === "pending"}>
                        Search
                    </button> */}
                    <SearchForm />
                </form>
                <aside
                    className={`${
                        suggestionsListOpen ? "block" : "hidden"
                    }    md:h-full max-h-60 overflow-y-auto`}
                >
                    <h2 className="flex gap-2 items-center justify-between py-2 px-4">
                        <p className="block flex-1 font-medium text-xl">
                            Search Results
                        </p>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            onClick={() => setSuggestionsListOpen(false)}
                        >
                            <ShieldClose className="shrink-0" />
                        </Button>
                    </h2>
                    <p className="h-4 px-4 text-destructive">{errorMessage}</p>

                    {searchStatus === "pending" && (
                        <div className="space-y-2">
                            {[...new Array(10)].map((_, idx) => (
                                <Skeleton key={idx} className="h-4 w-full" />
                            ))}
                        </div>
                    )}
                    <ul className="grid grid-cols-1  gap-4 w-full justify-start overflow-hidden  ">
                        {suggestions.map((suggest) => (
                            <li key={suggest.osm_id}>
                                {/* <Link
                                    href={`?lat=${suggest.lat}&lon=${suggest.lon}`}
                                >
                                    {suggest.display_name}
                                </Link> */}
                                <button
                                    onClick={() => {
                                        setSelectedLocation(suggest);
                                    }}
                                    className="pb-4 px-4 w-full"
                                >
                                    <h4 className="flex gap-2 items-center justify-start">
                                        <MapPinned className="w-6 h-6 shrink-0" />
                                        <div className="block pl-1 max-w-md md:max-w-xs whitespace-nowrap overflow-hidden text-ellipsis pr-2">
                                            {suggest.display_name}
                                        </div>
                                    </h4>
                                </button>
                                <div className="flex-grow border-t border-gray-400 "></div>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
            <MapContainer
                center={position}
                zoom={20}
                className="h-full w-full z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {selectedLocation && (
                    <Marker
                        position={{
                            lat: selectedLocation.lat,
                            lng: selectedLocation.lon,
                        }}
                        icon={icon}
                    >
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                )}
                {selectedLocation && (
                    <ResetCenterView
                        lat={selectedLocation.lat}
                        lon={selectedLocation.lon}
                    />
                )}
            </MapContainer>
        </div>
    );
}

export default LeafletMap;
