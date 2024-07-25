import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MapComponent = ({ data }) => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={2} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {data.map((countryData) => (
        <Marker position={[countryData.lat, countryData.long]}>
          <Popup>
            Cases: {countryData.cases}<br />
            Deaths: {countryData.deaths}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
