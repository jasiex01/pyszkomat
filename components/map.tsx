"use client";

import L from "leaflet";
import MarkerIcon from "../node_modules/leaflet/dist/images/marker-icon.png";
import MarkerShadow from "../node_modules/leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState } from "react";
import PopupDetails from "./popup-details";

interface MapProps {
  markers: Array<{ latitude: number; longitude: number; address: string; id: string }>;
}

const Map = ({ markers }: MapProps) => {
  const [coord, setCoord] = useState([51.1, 17.0333]);
  const [activePopup, setActivePopup] = useState<L.Popup | null>(null);

  const handleMouseOver = (e: any) => {
    if (activePopup !== e.target.getPopup()) {
      e.target.openPopup();
      setActivePopup(e.target.getPopup());
    }
  };

  const handleMouseOut = (e: any) => {
    if (activePopup === e.target.getPopup()) {
      setActivePopup(null);
    }
  };

  return (
    <div>
      <MapContainer
        style={{
          height: "80vh",
          width: "95vw",
          margin: "auto",
          position: "relative", // Ensure stacking context
          zIndex: 1, // Lower z-index for the map
        }}
        center={[coord[0], coord[1]]}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker, index) => (
          <Marker
            key={index}
            icon={
              new L.Icon({
                iconUrl: MarkerIcon.src,
                iconRetinaUrl: MarkerIcon.src,
                iconSize: [25, 41],
                iconAnchor: [12.5, 41],
                popupAnchor: [0, -41],
                shadowUrl: MarkerShadow.src,
                shadowSize: [41, 41],
              })
            }
            position={[marker.latitude, marker.longitude]}
            eventHandlers={{
              mouseover: handleMouseOver,
              mouseout: handleMouseOut,
            }}
          >
            <Popup>
              <PopupDetails
                address={marker.address}
                id={marker.id}
                isFavorite={marker.isFavorite}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
