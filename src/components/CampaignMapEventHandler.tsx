"use client";
import { LeafletEventHandlerFnMap } from "leaflet";
import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

export interface CampaignMapEventHandlerProps {
    eventHandlers: LeafletEventHandlerFnMap;
    lon?: number;
    lat?: number;
}

export function CampaignMapEventHandler({
    lat,
    lon,
    eventHandlers,
}: CampaignMapEventHandlerProps) {
    // Note: Workaround component as MapContainer eventHandlers is not working
    useMapEvents(eventHandlers);
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
