"use client";

import { MapContainer, Marker, Popup, TileLayer, Polyline, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { type Marker as TMarker, type LeafletMouseEvent } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { CampaignMapEventHandler } from "./CampaignMapEventHandler";
import { useMemo, useRef } from "react";
import usePlace from "@/hooks/usePlace";
import { LoaderIcon } from "lucide-react";
import AddNewPlace from "@/places-features/add-place";
import EditSelectedPlace from "@/places-features/edit-place";
import RatePlace from "@/places-features/rate-place";
import type { FetchedPlace } from "@/types";
import PlacesLocationsList from "./places-locations-list";

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
const icon = L.icon({
	iconUrl: "./add2.svg",
	iconSize: [20, 38],
	iconAnchor: [12, 28],
});

type LeafletMapProps = {
	initialLat: number;
	initialLon: number;
	places: FetchedPlace[];
};

const LoaderIndicator = () => (
	<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 grid place-items-center bg-foreground h-20 w-20 shadow-xl  rounded-lg ">
		<LoaderIcon className="shrink-0 animate-spin text-background" />
	</div>
);

function LeafletMap({ places, initialLat, initialLon }: LeafletMapProps) {
	const { setLocationData, place, kaabaPosition, searchParams } = usePlace();

	const addLocationMarkerRef = useRef<TMarker<any>>(null);
	// const placeMarkerRef = useRef<TMarker<any>>(null);

	// const addMosqueDialog = useMemo(() => {
	// 	if (location) return <AddPlaceForm triggerBtnHandler={() => addLocationMarkerRef.current?.closePopup()} />;
	// }, [location]);

	const onContextMenuClick = (event: LeafletMouseEvent) => {
		event.originalEvent.preventDefault();
		const { lat, lng } = event.latlng;
		if (!lat || !lng) return;
		setLocationData({
			location: {
				latitude: lat,
				longitude: lng,
			},
		});
	};

	const onMosqueClick = (event: LeafletMouseEvent, place: FetchedPlace) => {
		event.originalEvent.preventDefault();
		const { lat, lng } = event.latlng;
		if (!lat || !lng || !place) return;
		setLocationData({
			place,
		});
	};

	return (
		<MapContainer center={[initialLat, initialLon]} zoom={17} className="h-full w-full z-0">
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			<PlacesLocationsList places={places} />
			<CircleMarker
				center={[kaabaPosition.latitude, kaabaPosition.longitude]}
				radius={50}
				// fillOpacity={circleOpacity}
				stroke={false}
			>
				<Tooltip direction="right" offset={[-8, -2]} opacity={1}>
					<span>الكعبة : المسجد الحرام</span>
				</Tooltip>
			</CircleMarker>
			<Polyline
				positions={[
					[initialLat, initialLon],
					[kaabaPosition.latitude, kaabaPosition.longitude],
				]}
			/>

			<Marker
				position={{
					lat: initialLat,
					lng: initialLon,
				}}
				icon={icon}
				ref={addLocationMarkerRef}
			>
				<Popup>
					<AddNewPlace
						latitude={initialLat}
						longitude={initialLon}
						onDialogOpen={() =>
							new Promise(() => {
								addLocationMarkerRef.current?.closePopup();
							})
						}
					/>
				</Popup>
			</Marker>

			<CampaignMapEventHandler
				lat={parseFloat(searchParams.get("lat") ?? "")}
				lon={parseFloat(searchParams.get("lon") ?? "")}
				eventHandlers={{
					contextmenu: onContextMenuClick,
				}}
			/>
		</MapContainer>
	);
}

export default LeafletMap;
