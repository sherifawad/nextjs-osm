import { FetchedPlace } from "@/types";
import React, { useMemo, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L, { type Marker as TMarker, type LeafletMouseEvent } from "leaflet";
import EditSelectedPlace from "../edit-place";
import RatePlace from "../rate-place";
import usePlace from "@/hooks/usePlace";

const mosqueVerifiedMarker = L.icon({
	iconUrl: "./mosque-verified.svg",
	iconSize: [38, 38],
	iconAnchor: [23, 29],
});

const mosqueUnVerifiedMarker = L.icon({
	iconUrl: "./mosque-unVerified.svg",
	iconSize: [38, 38],
	iconAnchor: [23, 29],
});
const mosqueHiddenMarker = L.icon({
	iconUrl: "./mosque-hidden.svg",
	iconSize: [38, 38],
	iconAnchor: [23, 29],
});
const mosqueDeletedMarker = L.icon({
	iconUrl: "./mosque-deleted.svg",
	iconSize: [38, 38],
	iconAnchor: [23, 29],
});

type Props = {
	places: FetchedPlace[];
};

const PlacesLocationsList = ({ places }: Props) => {
	const { setLocationData, place } = usePlace();

	const placeMarkerRefs = useRef<TMarker<any>[]>([]);

	useMemo(() => {
		placeMarkerRefs.current = placeMarkerRefs.current.slice(0, places.length);
	}, [places]);

	const onMosqueClick = (event: LeafletMouseEvent, place: FetchedPlace) => {
		event.originalEvent.preventDefault();
		const { lat, lng } = event.latlng;
		if (!lat || !lng || !place) return;
		setLocationData({
			place,
		});
	};
	return (
		<MarkerClusterGroup
			chunkedLoading
			// iconCreateFunction={createClusterCustomIcon}
		>
			{places?.map((data, i) => (
				<Marker
					// ref={placeMarkerRefs.current[i]}
					ref={(el) => {
						if (el) {
							placeMarkerRefs.current[i] = el;
						}
					}}
					key={data.id}
					position={{
						lat: data.latitude,
						lng: data.longitude,
					}}
					icon={
						data.deleted
							? mosqueDeletedMarker
							: data.hidden
							? mosqueHiddenMarker
							: data.verified
							? mosqueVerifiedMarker
							: mosqueUnVerifiedMarker
					}
					eventHandlers={{
						click: (e) => onMosqueClick(e, data),
					}}
				>
					{place && (
						<Popup>
							{/* <PlaceMarkPopUp place={place} /> */}
							<EditSelectedPlace
								place={place}
								onDialogOpen={() =>
									new Promise(() => {
										placeMarkerRefs.current[i]?.closePopup();
									})
								}
							/>
							<RatePlace place={place} />
						</Popup>
					)}
				</Marker>
			))}
		</MarkerClusterGroup>
	);
};

export default PlacesLocationsList;
