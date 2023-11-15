"use client";

import { MapContainer, Marker, Popup, TileLayer, Polyline, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { type Marker as TMarker, type LeafletMouseEvent } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { CampaignMapEventHandler } from "../CampaignMapEventHandler";
import React, { useMemo, useRef, useState } from "react";
import { DataBasePlace, TPosition } from "@/lib/types";
import { Button } from "../ui/button";
import { setCookie } from "cookies-next";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useRouter } from "next/navigation";
import { addMosqueLocation } from "@/app/_actions";
import { signIn, useSession } from "next-auth/react";
import AddPlaceForm from "../forms/add-place-form";
import { PlaceMarkPopUp } from "./map-popups";
import { Place } from "@/schema/modelSchema";

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
	iconUrl: "./pinmap.svg",
	iconSize: [20, 38],
	iconAnchor: [12, 28],
});

const kabaPostion = {
	lat: 21.42249,
	lon: 39.8262,
};

type LeafletMapProps = {
	initialLat?: number;
	initialLon?: number;
	places: DataBasePlace[];
};

function LeafletMap({ initialLat = kabaPostion.lat, initialLon = kabaPostion.lon, places }: LeafletMapProps) {
	const popUpRef = useRef<TMarker<any>>(null);
	const MosqueMarkerRef = useRef<TMarker<any>>(null);
	const { data: Session, status } = useSession();
	const router = useRouter();

	const [showPopUp, setShowPopUp] = useState(false);
	const [clickedPosition, setClickedPosition] = useState<TPosition>(kabaPostion);
	router.replace(`?lat=${initialLat}&lon=${initialLon}`);

	const onContextMenuClick = (event: LeafletMouseEvent) => {
		event.originalEvent.preventDefault();
		const { lat, lng } = event.latlng;
		if (!lat || !lng) return;
		setClickedPosition({ lat, lon: lng });
		setShowPopUp(true);
		popUpRef.current?.openPopup();
		MosqueMarkerRef.current?.closePopup();

		setCookie("lat", lat, { secure: true, sameSite: "none" });
		setCookie("lon", lng, { secure: true, sameSite: "none" });
		router.replace(`?lat=${lat}&lon=${lng}`);
	};
	const onMosqueClick = (event: LeafletMouseEvent) => {
		event.originalEvent.preventDefault();
		const { lat, lng } = event.latlng;
		if (!lat || !lng) return;
		setClickedPosition({ lat, lon: lng });
		popUpRef.current?.closePopup();
		MosqueMarkerRef.current?.openPopup();

		setCookie("lat", lat, { secure: true, sameSite: "none" });
		setCookie("lon", lng, { secure: true, sameSite: "none" });
		router.replace(`?lat=${lat}&lon=${lng}`);
	};

	const addMosqueDialog = useMemo(
		() =>
			status === "authenticated" && Session.user.userReputation > 0 ? (
				<AlertDialog>
					<AlertDialogTrigger>
						<Button onClick={() => popUpRef.current?.closePopup()}>Add new Mosque Location</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AddPlaceForm />
					</AlertDialogContent>
				</AlertDialog>
			) : (
				<Button onClick={() => signIn()}>Login to Add Mosque</Button>
			),
		[Session?.user?.userReputation, status]
	);

	return (
		<MapContainer center={[initialLat, initialLon]} zoom={17} className="h-full w-full z-0">
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<CircleMarker
				center={[kabaPostion.lat, kabaPostion.lon]}
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
					[kabaPostion.lat, kabaPostion.lon],
				]}
			/>
			<Marker
				position={{
					lat: initialLat,
					lng: initialLon,
				}}
				icon={icon}
			></Marker>
			<MarkerClusterGroup
				chunkedLoading
				// iconCreateFunction={createClusterCustomIcon}
			>
				{places?.map((data) => (
					<Marker
						ref={MosqueMarkerRef}
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
							click: onMosqueClick,
						}}
					>
						<Popup>
							<PlaceMarkPopUp place={data} />
						</Popup>
					</Marker>
				))}
			</MarkerClusterGroup>
			<CampaignMapEventHandler
				lat={initialLat}
				lon={initialLon}
				eventHandlers={{
					contextmenu: onContextMenuClick,
				}}
			/>
			<Marker
				ref={popUpRef}
				position={{
					lat: clickedPosition.lat,
					lng: clickedPosition.lon,
				}}
				icon={icon}
			>
				<Popup>
					<div className="text-center">
						<p>
							Latitude: <span>{clickedPosition.lat}</span>
						</p>
						<p>
							Longitude: <span>{clickedPosition.lon}</span>
						</p>
						{addMosqueDialog}
					</div>
				</Popup>
			</Marker>
		</MapContainer>
	);
}

export default LeafletMap;
