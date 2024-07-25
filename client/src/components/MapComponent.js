import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MapComponent = ({ data }) => {
  // 计算总数据
  const totalCases = data.reduce((acc, country) => acc + country.cases, 0);
  const totalDeaths = data.reduce((acc, country) => acc + country.deaths, 0);
  
  return (
    <div>
      {/* 数据总览面板 */}
      <div style={{ padding: '10px', background: '#f2f2f2', textAlign: 'center' }}>
        <h2>Global COVID-19 Data Overview</h2>
        <p><b>Total Cases:</b> {totalCases.toLocaleString()}</p>
        <p><b>Total Deaths:</b> {totalDeaths.toLocaleString()}</p>
      </div>

      {/* 地图容器 */}
      <MapContainer center={[51.505, -0.09]} zoom={2} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data.map((countryData, index) => (
          <Marker 
            key={index}
            position={[countryData.lat, countryData.long]}
            eventHandlers={{
              mouseover: (e) => {
                e.target.openPopup();
              },
              mouseout: (e) => {
                e.target.closePopup();
              }
            }}
          >
            <Popup>
              <b>{countryData.country}</b><br />
              Cases: {countryData.cases.toLocaleString()}<br />
              Deaths: {countryData.deaths.toLocaleString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
