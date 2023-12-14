"use client";

import { MapContainer, Marker, Popup, TileLayer, Polyline, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { type Marker as TMarker, type LeafletMouseEvent } from "leaflet";
import { CampaignMapEventHandler } from "./CampaignMapEventHandler";
import { useRef } from "react";
import usePlace from "@/hooks/usePlace";
import { LoaderIcon } from "lucide-react";
import AddNewPlace from "@/places-features/add-place";
import type { FetchedPlace } from "@/types";
import PlacesLocationsList from "./places-locations-list";

const icon = L.icon({
	iconUrl: "./add2.svg",
	iconSize: [20, 33],
	iconAnchor: [12, 28],
	//shadowUrl: 'leaf-shadow.png',
	//shadowSize: [50, 64], // size of the shadow
	//shadowAnchor: [4, 62], // the same for the shadow
	// popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
	className: "",
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

	return (
		<MapContainer center={[initialLat, initialLon]} zoom={17} className="h-full w-full z-0">
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
			<PlacesLocationsList places={places} markerRef={addLocationMarkerRef} />

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
