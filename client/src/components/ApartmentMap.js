import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Leaflet's default icon paths break under webpack; point them at the
// bundled images explicitly.
const defaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/**
 * OpenStreetMap view of an apartment's position. Renders a friendly
 * placeholder when the apartment has no stored coordinates.
 */
const ApartmentMap = ({ latitude, longitude, label }) => {
  const hasCoords =
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude);

  if (!hasCoords) {
    return (
      <div
        className="d-flex align-items-center justify-content-center bg-light text-muted rounded"
        style={{ height: '300px' }}
      >
        <span>📍 Map unavailable — no coordinates set for this listing.</span>
      </div>
    );
  }

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={14}
      style={{ height: '300px', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} icon={defaultIcon}>
        {label && <Popup>{label}</Popup>}
      </Marker>
    </MapContainer>
  );
};

export default ApartmentMap;
