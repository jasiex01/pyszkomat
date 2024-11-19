"use client";

import L from "leaflet";
import MarkerIcon from "../node_modules/leaflet/dist/images/marker-icon.png";
import MarkerShadow from "../node_modules/leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import PopupDetails from "./popup-details";

const Map = () => {
  const [coord, setCoord] = useState([51.1, 17.0333]);
  const [markers, setMarkers] = useState([]);

  // Fetch marker data from the API endpoint
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await fetch("/api/frontend/parcel_machines");
        const data = await response.json();
        setMarkers(data);
      } catch (error) {
        console.error("Error fetching marker data:", error);
      }
    };

    fetchMarkers();
  }, []);

  return (
    <div>
      <MapContainer
        style={{
          height: "80vh",
          width: "95vw",
          margin: "auto",
        }}
        center={[coord[0], coord[1]]}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Map over the markers array and create Marker components */}
        {markers.map((marker: any, index) => (
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
          >
            <Popup>
              <PopupDetails address={marker.address} id={marker.id} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
