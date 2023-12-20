"use client";
import { LeafletEventHandlerFnMap } from "leaflet";
import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";

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
    if (lat && !isNaN(lat) && lon && !isNaN(lon)) {
      map.setView({ lat, lng: lon }, map.getZoom(), {
        animate: true,
      });
    }
  }, [map, lat, lon]);

  return null;
}
