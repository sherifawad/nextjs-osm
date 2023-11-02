"use client";

import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    Polyline,
    CircleMarker,
    Tooltip,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { type Marker as TMarker, type LeafletMouseEvent } from "leaflet";
import { tantaMosques } from "@/lib/data/tanta/tanta-mosq";
import MarkerClusterGroup from "react-leaflet-cluster";
import { CampaignMapEventHandler } from "../CampaignMapEventHandler";
import { useEffect, useMemo, useRef, useState } from "react";
import { TPosition, Tominatim } from "@/lib/types";
import { Button } from "../ui/button";
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

const iconMarker = L.icon({
    iconUrl: "./mosque.svg",
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
};

function LeafletMap({
    initialLat = kabaPostion.lat,
    initialLon = kabaPostion.lon,
}: LeafletMapProps) {
    const [showPopUp, setShowPopUp] = useState(false);
    const [clickedPosition, setClickedPosition] =
        useState<TPosition>(kabaPostion);
    const router = useRouter();
    const popUpRef = useRef<TMarker<any>>(null);

    const onContextMenuClick = (event: LeafletMouseEvent) => {
        event.originalEvent.preventDefault();
        const { lat, lng } = event.latlng;
        if (!lat || !lng) return;
        router.replace(`?lat=${lat}&lon=${lng}`);
        setClickedPosition({ lat, lon: lng });
        setShowPopUp(true);
        popUpRef.current?.openPopup();
    };

    const addMosqueDialog = useMemo(
        () => (
            <AlertDialog>
                <AlertDialogTrigger>
                    <Button>Add new Mosque Location</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <form action={addMosqueLocation}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Add new Mosque Location
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="pt-4">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction type="submit">
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        ),
        []
    );

    return (
        <MapContainer
            center={[initialLat, initialLon]}
            zoom={17}
            className="h-full w-full z-0"
        >
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
            </MarkerClusterGroup>
            <CampaignMapEventHandler
                lat={initialLat}
                lon={initialLon}
                eventHandlers={{
                    contextmenu: onContextMenuClick,
                }}
            />
            {showPopUp ? (
                <Marker
                    ref={popUpRef}
                    position={{
                        lat: clickedPosition.lat,
                        lng: clickedPosition.lon,
                    }}
                    icon={icon}
                >
                    <Popup>
                        <div>
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
            ) : null}
        </MapContainer>
    );
}

export default LeafletMap;
