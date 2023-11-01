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
import L, { type LeafletMouseEvent } from "leaflet";
import { tantaMosques } from "@/lib/data/tanta/tanta-mosq";
import MarkerClusterGroup from "react-leaflet-cluster";
import { CampaignMapEventHandler } from "../CampaignMapEventHandler";
import { useEffect, useRef } from "react";
import { Tominatim } from "@/lib/types";

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

const position = {
    lat: 30.786883,
    lng: 30.999614,
};

const kabaPostion = {
    lat: 21.42249,
    lon: 39.8262,
};

// custom cluster icon
// const createClusterCustomIcon = function (cluster) {
//     return L.divIcon({
//         html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
//         className: "custom-marker-cluster",
//         iconSize: point(33, 33, true),
//     });
// };

// function ResetCenterView({ lat, lon }: { lon: number; lat: number }) {
//     const map = useMap();

//     useEffect(() => {
//         if (lat && lon) {
//             map.setView(L.latLng(lat, lon), map.getZoom(), {
//                 animate: true,
//             });
//         }
//     }, [map, lat, lon]);

//     return null;
// }

type LeafletMapProps = {
    // location: Signal<Tominatim>;
    // location: Tominatim;
    // setLocation: Dispatch<React.SetStateAction<Tominatim>>;
    initialLat?: number;
    initialLon?: number;
};

function LeafletMap({
    initialLat = kabaPostion.lat,
    initialLon = kabaPostion.lon,
}: LeafletMapProps) {
    // const initialLat = location.lat;
    // const initialLon = location.lon;
    // const initialLat = isNaN(Number(latPars))
    //     ? kabaPostion.lat
    //     : Number(latPars);
    // const initialLon = isNaN(Number(lonPars))
    //     ? kabaPostion.lon
    //     : Number(lonPars);

    // const SheetRef = useRef<HTMLButtonElement>(null);
    // const PopOverRef = useRef<HTMLButtonElement>(null);

    const onContextMenuClick = (event: LeafletMouseEvent) => {
        event.originalEvent.preventDefault();
        console.log(
            "🚀 ~ file: LeafletMap.tsx:103 ~ onContextMenuClick ~ event:",
            event.originalEvent
        );
        // setPosition({
        //     xy: {
        //         x: event.originalEvent.clientX,
        //         y: event.originalEvent.clientY,
        //     } as PointXY,
        //     latlon: event.latlng,
        // } as ClickPosition);
    };

    return (
        <MapContainer
            center={[initialLat, initialLon]}
            // center={[location.value.lat, location.value.lon]}
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
            {/* {location.value && (
                <Polyline
                    positions={[
                        [location.value.lat, location.value.lon],
                        [kabaPostion.lat, kabaPostion.lon],
                    ]}
                />
            )} */}
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
            {/* {location.value && (
                <Marker
                    position={{
                        lat: location.value.lat,
                        lng: location.value.lon,
                    }}
                    icon={icon}
                >
                    <Popup>{location.value.display_name}</Popup>
                </Marker>
            )} */}
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
            {/* <ResetCenterView lat={initialLat} lon={initialLon} /> */}

            {/* {location.value && (
                <ResetCenterView
                    lat={location.value.lat}
                    lon={location.value.lon}
                />
            )} */}
            <CampaignMapEventHandler
                lat={initialLat}
                lon={initialLon}
                eventHandlers={{
                    contextmenu: onContextMenuClick,
                }}
            />
        </MapContainer>
    );
}

export default LeafletMap;
