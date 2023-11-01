"use client";

import { getSuggestions } from "@/app/_actions";
import { SearchStatus, Tominatim } from "@/lib/types";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useEffect, useState } from "react";
import z from "zod";
import SearchForm from "./SearchForm";
import SearchSideBar from "./SearchSideBar";

type PlacesProps = {
    initialSearch?: string;
    initialLat?: number;
    initialLon?: number;
};

type TPlaceData = {
    search?: string;
    lat?: number;
    long?: number;
    location: Tominatim;
};

function Places({ initialSearch, initialLat, initialLon }: PlacesProps) {
    console.log("🚀 ~ file: Places.tsx:30 ~ Places ~ Places:Render");
    const [PlaceData, setPlaceData] = useState<TPlaceData>({
        lat: initialLat,
        long: initialLon,
        search: initialSearch,
        location: {
            lat: 0,
            lon: 0,
        },
    });

    const router = useRouter();

    const [searchStatus, setSearchStatus] = useState<SearchStatus>(undefined);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [suggestions, setSuggestions] = useState<Tominatim[]>([]);

    const [suggestionsListOpen, setSuggestionsListOpen] = useState(false);

    useEffect(() => {
        searchPlace(initialSearch);
    }, [initialSearch]);

    const onGeoSuccess = (locationInput: GeolocationPosition) => {
        const lat = locationInput.coords.latitude;
        const long = locationInput.coords.longitude;
        setPlaceData((prev) => ({
            ...prev,
            lat,
            long,
            locations: {
                lat,
                lon: long,
                display_name: "your location",
            },
            search: "",
        }));
        router.replace(`?lat=${lat}&lon=${long}`);
    };

    const handleGetLocation = () => {
        navigator.geolocation.getCurrentPosition(onGeoSuccess, (error) => {
            alert(error.message);
        });
    };

    const searchPlace = async (input: unknown) => {
        console.log(
            "🚀 ~ file: Places.tsx:119 ~ searchPlace ~ searchPlace:",
            searchPlace
        );

        setErrorMessage("");
        setSearchStatus("pending");
        setSuggestionsListOpen(true);
        setSuggestions([]);

        const schema = z.string().min(3);
        const validateData = schema.safeParse(input);
        if (!validateData.success) {
            setSearchStatus("error");
            setErrorMessage(validateData.error.issues[0].message);
            return false;
        }
        const suggestions = await getSuggestions(validateData.data);
        if (suggestions === null || suggestions.length < 1) {
            setSearchStatus("error");
            setErrorMessage("could not find suggestions");
            return false;
        }
        setSuggestions(suggestions);
        setSearchStatus("success");
        setErrorMessage("");

        setPlaceData((prev) => ({
            ...prev,
            search: validateData.data,
        }));
        return true;
    };

    const handleSubmitAction = async (e: SyntheticEvent) => {
        setErrorMessage("");
        setSearchStatus("pending");
        setSuggestionsListOpen(true);
        setSuggestions([]);

        e.preventDefault();

        const schema = z.string().min(3);

        const target = e.target as typeof e.target & {
            search: { value: string };
        };

        const searchResult = await searchPlace(target.search.value);
        if (searchResult) {
            router.replace(
                `?lat=${PlaceData.lat}&lon=${PlaceData.long}&search=${target.search.value}`
            );
        }
    };
    return (
        <div
            className={`md:absolute block ${
                suggestionsListOpen ? "bottom-0 bg-background shadow-none" : ""
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
            <SearchSideBar
                suggestions={suggestions}
                searchKey={PlaceData.search}
                closeHandler={() => setSuggestionsListOpen(false)}
                errorMessage={errorMessage}
                suggestionsListOpen={suggestionsListOpen}
                searchStatus={searchStatus}
            />
        </div>
    );
}

export default Places;
