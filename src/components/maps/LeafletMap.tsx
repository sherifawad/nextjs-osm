"use client";

import { MapContainer, Marker, Popup, TileLayer, Polyline, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { type Marker as TMarker, type LeafletMouseEvent } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { CampaignMapEventHandler } from "../CampaignMapEventHandler";
import { useEffect, useMemo, useRef } from "react";
import { DataBasePlace } from "@/lib/types";
import AddPlaceForm from "../forms/add-place-form";
import { PlaceMarkPopUp } from "./map-popups";
import usePlace from "@/hooks/usePlace";
import { LoaderIcon } from "lucide-react";

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
	initialLat?: number;
	initialLon?: number;
	places: DataBasePlace[];
};

const LoaderIndicator = () => (
	<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 grid place-items-center bg-foreground h-20 w-20 shadow-xl  rounded-lg ">
		<LoaderIcon className="shrink-0 animate-spin text-background" />
	</div>
);

function LeafletMap({ places }: LeafletMapProps) {
	const { location, setLocationData, place, kaabaPosition, searchParams } = usePlace();

	const addLocationMarkerRef = useRef<TMarker<any>>(null);

	const addMosqueDialog = useMemo(() => {
		if (location) return <AddPlaceForm triggerBtnHandler={() => addLocationMarkerRef.current?.closePopup()} />;
	}, [location]);

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

	const onMosqueClick = (event: LeafletMouseEvent, place: DataBasePlace) => {
		event.originalEvent.preventDefault();
		const { lat, lng } = event.latlng;
		if (!lat || !lng || !place) return;
		setLocationData({
			place,
		});
	};

	return (
		<MapContainer center={[location.latitude, location.longitude]} zoom={17} className="h-full w-full z-0">
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			<MarkerClusterGroup
				chunkedLoading
				// iconCreateFunction={createClusterCustomIcon}
			>
				{places?.map((data) => (
					<Marker
						// ref={mosqueMarkerRef}
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
								<PlaceMarkPopUp place={place} />
							</Popup>
						)}
					</Marker>
				))}
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
						[location.latitude, location.longitude],
						[kaabaPosition.latitude, kaabaPosition.longitude],
					]}
				/>
			</MarkerClusterGroup>

			<Marker
				position={{
					lat: location.latitude,
					lng: location.longitude,
				}}
				icon={icon}
				ref={addLocationMarkerRef}
			>
				<Popup>
					<div className="text-center">
						<p>
							Latitude: <span>{location.latitude}</span>
						</p>
						<p>
							Longitude: <span>{location.longitude}</span>
						</p>
						{addMosqueDialog}
					</div>
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
