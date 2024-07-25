import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Divider from '@mui/material/Divider';
import './styles.css';

const MapComponent = ({ data }) => {
  // 计算总数据
  const totalCases = data.reduce((acc, country) => acc + country.cases, 0);
  const totalDeaths = data.reduce((acc, country) => acc + country.deaths, 0);
  
  return (
    <div>
      {/* 数据总览面板 */}
      <div className="data-overview-panel">
  <div style={{ textAlign: 'center' }}>
    <h2 style={{ margin: '0 0 10px 0' }}>TOTAL CASES</h2>
    <p style={{ fontSize: '30px',  margin: '0' }}>{totalCases.toLocaleString()}</p>
  </div>
  <Divider orientation="vertical" flexItem style={{ margin: '0 20px' }} />
  <div style={{ textAlign: 'center' }}>
    <h2 style={{ margin: '0 0 10px 0' }}>TOTAL DEATHS</h2>
    <p style={{ fontSize: '30px', margin: '0', color: 'red' }}>{totalDeaths.toLocaleString()}</p>
  </div>
  <Divider orientation="vertical" flexItem style={{ margin: '0 20px' }} />
  <div style={{ textAlign: 'center' }}>
    <h2 style={{ margin: '0 0 10px 0' }}>TOTAL RECOVERED</h2>
    <p style={{ fontSize: '30px', margin: '0' }}>xxxxx</p>
  </div>
</div>


     {/* 地图容器 */}
      <MapContainer
        center={[51.505, -0.09]}
        zoom={2}
        className="map-container"
      >
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
