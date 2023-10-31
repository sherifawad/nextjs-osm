"use client";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import z from "zod";
import L from "leaflet";
import { getSuggestions } from "@/app/_actions";
import { Tominatim } from "@/lib/types";
import SearchForm from "../SearchForm";
import { Button } from "../ui/button";
import { MapPinned, ShieldClose } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { tantaMosques } from "@/lib/data/tanta/tanta-mosq";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const iconMarker = L.icon({
    iconUrl: "./mosque.svg",
    iconSize: [38, 38],
    iconAnchor: [23, 29],
});
const icon = L.icon({
    iconUrl: "./pinmap.svg",
    iconSize: [20, 38],
    iconAnchor: [28, 19],
});

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

function LeafletMap() {
    const router = useRouter();

    const searchParams = useSearchParams();
    const initialLat = searchParams.get("lat");
    const initialLon = searchParams.get("lon");

    const [searchStatus, setSearchStatus] = useState<string | undefined>(
        undefined
    );
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [suggestions, setSuggestions] = useState<Tominatim[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Tominatim>({
        lat: Number(initialLat),
        lon: Number(initialLon),
    });
    const [suggestionsListOpen, setSuggestionsListOpen] = useState(false);
    const SheetRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (searchStatus === "success") {
            SheetRef.current?.click();
        }
    }, [searchStatus]);

    const handleLocationSelection = (location: Tominatim) => {
        if (!location) return;
        setSelectedLocation(location);
        router.replace(`?lat=${location.lat}&lon=${location.lon}`);
    };

    const handleGetLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (location) => {
                router.replace(
                    `?lat=${location.coords.latitude}&lon=${location.coords.longitude}`
                );
                setSelectedLocation({
                    lat: location.coords.latitude,
                    lon: location.coords.longitude,
                    display_name: "your location",
                });
            },
            (error) => {
                alert(error.message);
            }
        );
    };

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
                    <SearchForm
                        showLocationButton
                        getLocationHandler={handleGetLocation}
                    />
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
                                <button
                                    // href={`?lat=${suggest.lat}&lon=${suggest.lon}`}
                                    onClick={() => {
                                        handleLocationSelection(suggest);
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
                zoom={17}
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
                        <Popup>{selectedLocation.display_name}</Popup>
                    </Marker>
                )}
                {tantaMosques.map((data) => (
                    <Marker
                        key={`${data.lat}-${data.lon}`}
                        position={{
                            lat: data.lat,
                            lng: data.lon,
                        }}
                        icon={iconMarker}
                    >
                        <Popup>{data.label_ar}</Popup>
                    </Marker>
                ))}
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
