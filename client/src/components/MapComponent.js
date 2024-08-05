import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import Divider from '@mui/material/Divider';
import './styles.css';

const MapComponent = ({ data }) => {
  // 计算总数据
  const totalCases = data.reduce((acc, country) => acc + country.total_cases, 0);
  const totalDeaths = data.reduce((acc, country) => acc + country.total_deaths, 0);
  // 计算最大病例数，用于标准化圆形大小
  const maxCases = Math.max(...data.map(country => country.total_cases));

    // 计算圆的大小
    const calculateRadius = (cases) => {
      const minRadius = 1; // 最小半径
      const maxRadius = 10; // 最大半径
      // 使用对数缩放确保大小均匀分布
      const radius = Math.log(cases + 1) / Math.log(maxCases + 1) * maxRadius;
      return Math.max(radius, minRadius);
    };


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
</div>


     {/* 地图容器 */}
     <MapContainer center={[51.505, -0.09]} zoom={2} className="map-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data.map((countryData, index) => (
          <CircleMarker
            key={index}
            center={[countryData.Latitude, countryData.Longitude]}
            radius={calculateRadius(countryData.total_cases)} // 动态半径大小
            fillColor="#007bff"
            color="#007bff"
            weight={1}
            fillOpacity={0.5}
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
              <b>{countryData.Country}</b><br />
              Cases: {countryData.total_cases.toLocaleString()}<br />
              Deaths: {countryData.total_deaths.toLocaleString()}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
