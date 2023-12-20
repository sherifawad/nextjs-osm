import { FetchedPlace } from "@/types";
import React, { RefObject, useMemo, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L, { type Marker as TMarker, type LeafletMouseEvent } from "leaflet";
import EditSelectedPlace from "../edit-place";
import RatePlace from "../rate-place";
import usePlace from "@/lib/hooks/usePlace";
import "leaflet/dist/leaflet.css";

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

const createClusterCustomIcon = function (cluster: any) {
  return new L.DivIcon({
    html: `<span>${(cluster as L.MarkerClusterGroup).getChildCount()}</span>`,
    className: "marker-cluster marker-cluster-small",
    iconSize: L.point(45, 45, true),
  });
};

type Props = {
  places: FetchedPlace[];
  markerRef: RefObject<TMarker<any>>;
};

const PlacesLocationsList = ({ places, markerRef }: Props) => {
  // console.log("🚀 ~ file: places-locations-list.tsx:38 ~ PlacesLocationsList ~ markerRef:", markerRef.current);
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
      onClick={() => {}}
      onContextMenu={() => {}}
      maxClusterRadius={15}
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
