"use client";

import { useState } from "react";
import Map, { Source, Layer, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

function MapView() {
    const [map, setMap] = useState<MapRef | null>(null);

    return (
        <Map ref={setMap}>
            <Source
                id="osm"
                type="raster"
                tiles={["https://tile.openstreetmap.org/{z}/{x}/{y}.png"]}
            >
                <Layer id="basemap" type="raster" source="osm" />
            </Source>
        </Map>
    );
}

export default MapView;
