"use client";

import { getSuggestions } from "@/app/_actions";
import { SearchStatus, Tominatim } from "@/lib/types";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import z from "zod";
import SearchForm from "./SearchForm";
import SearchSideBar from "./SearchSideBar";
import usePlace from "@/hooks/usePlace";

type PlacesProps = {
	initialSearch?: string;
};

type TPlaceData = {
	search?: string;
	lat?: number;
	long?: number;
	location: Tominatim;
};

function Places({ initialSearch }: PlacesProps) {
	const { setLocationData } = usePlace();

	const [searchStatus, setSearchStatus] = useState<SearchStatus>(undefined);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [suggestions, setSuggestions] = useState<Tominatim[]>([]);

	const [suggestionsListOpen, setSuggestionsListOpen] = useState(false);

	const [searchTerm, setSearchTerm] = useState("");

	const onGeoSuccess = (locationInput: GeolocationPosition) => {
		const lat = locationInput.coords.latitude;
		const long = locationInput.coords.longitude;
		setLocationData({ location: { latitude: lat, longitude: long } });
	};

	const handleGetLocation = () => {
		navigator.geolocation.getCurrentPosition(onGeoSuccess, (error) => {
			alert(error.message);
		});
	};

	const searchPlace = useCallback(async (input: unknown) => {
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

		setSearchTerm(validateData.data);

		setSuggestions(suggestions);
		setSearchStatus("success");
		setErrorMessage("");

		return true;
	}, []);

	const handleLocationSelection = (selected: Tominatim) => {
		setLocationData({ location: { latitude: selected.lat, longitude: selected.lon }, search: searchTerm });
	};

	const handleSubmitAction = async (e: SyntheticEvent) => {
		setErrorMessage("");
		setSearchStatus("pending");
		setSuggestionsListOpen(true);
		setSuggestions([]);
		setSearchTerm("");

		e.preventDefault();

		const target = e.target as typeof e.target & {
			search: { value: string };
		};

		const searchResult = await searchPlace(target.search.value);
		if (searchResult) {
			setLocationData({
				search: target.search.value,
			});
		}
	};

	const closeHandler = () => {
		setSuggestionsListOpen(false);
		setLocationData({});
	};

	useEffect(() => {
		if (initialSearch) {
			searchPlace(decodeURI(initialSearch));
		}
	}, [initialSearch, searchPlace]);

	return (
		<div
			className={`md:absolute block ${
				suggestionsListOpen ? "bottom-0 bg-background shadow-none" : ""
			}  top-0 right-4 md:z-10 w-full md:w-[300px] lg:w-[400px] `}
		>
			<form onSubmit={handleSubmitAction} className="bg-slate-100 dark:bg-slate-600 p-2">
				<SearchForm showLocationButton getLocationHandler={handleGetLocation} />
			</form>
			<SearchSideBar
				suggestions={suggestions}
				closeHandler={closeHandler}
				errorMessage={errorMessage}
				suggestionsListOpen={suggestionsListOpen}
				searchStatus={searchStatus}
				handleLocationSelection={handleLocationSelection}
			/>
		</div>
	);
}

export default Places;
