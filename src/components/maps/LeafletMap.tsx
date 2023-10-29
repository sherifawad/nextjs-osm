"use client";
import { useSearchParams } from "next/navigation";
import React, { FormEvent, SyntheticEvent, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import z from "zod";
import L from "leaflet";
import { getSuggestions } from "@/app/_actions";
import { Tominatim } from "@/lib/types";
import Link from "next/link";

const icon = L.icon({
    iconUrl: "./placeholder.png",
    iconSize: [38, 38],
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

    const handleSubmitAction = async (e: SyntheticEvent) => {
        setErrorMessage("");
        setSearchStatus("pending");
        e.preventDefault();

        const schema = z.string().min(3);

        const target = e.target as typeof e.target & {
            search: { value: string };
        };

        const validateData = schema.safeParse(target.search.value);
        if (!validateData.success) {
            setSearchStatus("error");
            setErrorMessage(validateData.error.message);
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
        <div className="flex flex-col">
            <div>
                <form onSubmit={handleSubmitAction}>
                    <input type="search" placeholder="Search" name="search" />
                    <button type="submit" disabled={searchStatus === "pending"}>
                        Search
                    </button>
                </form>
                <p className="h-4">{errorMessage}</p>
                {searchStatus === "pending" && (
                    <p className="h-4">Loading ....</p>
                )}

                {searchStatus === "success" && (
                    <ul>
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
                                >
                                    {suggest.display_name}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <MapContainer
                center={position}
                zoom={20}
                style={{ width: "100%", height: "80vh" }}
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
