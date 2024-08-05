import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
const config = require('../config.json');  // 确保这个路径正确，且 config.json 包含所需的 server_host 和 server_port

function convertToGeoJSON(data) {
    return {
        type: "FeatureCollection",
        features: data.map(item => ({
            type: "Feature",
            properties: {
                state: item.state,
                total_cases: item.total_cases,
                total_deaths: item.total_deaths
            },
            geometry: {
                type: "Point",
                coordinates: item.geo_point_2d.slice().reverse()  // 通常需要经度在前，纬度在后
            }
        }))
    };
}

const CovidDataPage = () => {
    const [geoJsonData, setGeoJsonData] = useState(null);

    useEffect(() => {
        // 从 API 获取数据
        const apiUrl = `http://${config.server_host}:${config.server_port}/covid-country-data`;
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // 将数据转换为 GeoJSON
                const geoJSON = convertToGeoJSON(data);
                setGeoJsonData(geoJSON);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <MapContainer center={[37.8, -96]} zoom={4} style={{ height: '500px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {geoJsonData && <GeoJSON data={geoJsonData} style={{color: '#3388ff'}} />}  // 添加样式参数以定制地图标记或线条
        </MapContainer>
    );
};

export default CovidDataPage;
