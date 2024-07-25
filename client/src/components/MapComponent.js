import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MapComponent = ({ data }) => {
  // 计算总数据
  const totalCases = data.reduce((acc, country) => acc + country.cases, 0);
  const totalDeaths = data.reduce((acc, country) => acc + country.deaths, 0);
  
  return (
    <div>
      {/* 数据总览面板 */}
      <div style={{
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: '20px',
  background: 'black', // 渐变背景
  color: 'white',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '0px',
  margin: '0px auto',

}}>
  <div style={{ textAlign: 'center' }}>
    <h2 style={{ margin: '0 0 10px 0' }}>TOTAL CASES</h2>
    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{totalCases.toLocaleString()}</p>
  </div>
  <div style={{ textAlign: 'center' }}>
    <h2 style={{ margin: '0 0 10px 0' }}>TOTAL DEATHS</h2>
    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{totalDeaths.toLocaleString()}</p>
  </div>
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
