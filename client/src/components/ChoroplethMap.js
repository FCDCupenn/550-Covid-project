import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { statesData } from './us-states'; // 确保路径是正确的
const config = require('../config.json');

function ChoroplethMap({ onDataLoaded }) {
  const [covidData, setCovidData] = useState([]);
  const infoRef = useRef(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/covid-data`)
      .then(response => response.json())
      .then(data => {
        console.log(data); // 查看数据结构
        setCovidData(data); // 存储从API获取的COVID数据
        // 计算总病例数和总死亡数
        const totalCases = data.reduce((sum, state) => sum + state.cases, 0);
        const totalDeaths = data.reduce((sum, state) => sum + state.deaths, 0);
        onDataLoaded({ totalCases, totalDeaths });
      })
      .catch(error => console.error('Error fetching COVID data:', error));
  }, [onDataLoaded]);

  // Custom control for displaying state information
  const InfoControl = () => {
    const map = useMap();

    useEffect(() => {
      const info = L.control();

      info.onAdd = function () {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
      };

      info.update = function (props) {
        console.log('Update info with props:', props); // 调试信息
        this._div.innerHTML = '<h4>COVID-19 Data</h4>' + (props ?
          '<b>' + props.name + '</b><br />Cases: ' + props.cases + '<br />Deaths: ' + props.deaths :
          'Hover over a state');
      };

      info.addTo(map);
      infoRef.current = info;

      return () => {
        info.remove();
      };
    }, [map]);

    return null;
  };

  const getColor = (cases) => {
    return cases > 2000000 ? '#800026' :
           cases > 1000000 ? '#BD0026' :
           cases > 500000  ? '#E31A1C' :
           cases > 200000  ? '#FC4E2A' :
           cases > 100000  ? '#FD8D3C' :
           cases > 50000   ? '#FEB24C' :
           cases > 20000   ? '#FED976' :
                             '#FFEDA0';
  };

  const geoJsonStyle = useMemo(() => (feature) => {
    const stateInfo = covidData.find(data => data.state === feature.properties.name);
    console.log('GeoJSON Style state info:', stateInfo); // 调试信息
    return {
      fillColor: stateInfo ? getColor(stateInfo.cases) : '#FFFFFF', // 使用白色作为未匹配到数据的默认颜色
      weight: 2,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  }, [covidData]);

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        const stateInfo = covidData.find(data => data.state === feature.properties.name);
        console.log('Mouseover state info:', stateInfo); // 调试信息
        layer.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.8
        });
        layer.bringToFront();
        if (infoRef.current) {
          infoRef.current.update(stateInfo ? {...feature.properties, cases: stateInfo.cases, deaths: stateInfo.deaths} : feature.properties);
        }
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(geoJsonStyle(feature)); // 重置为初始样式
        if (infoRef.current) {
          infoRef.current.update();
        }
      }
    });
  };

  return covidData.length > 0 ? (
    <MapContainer center={[37.8, -96]} zoom={4} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeoJSON data={statesData} style={geoJsonStyle} onEachFeature={onEachFeature} />
      <InfoControl />
    </MapContainer>
  ) : <p>Loading data...</p>;
  
}

export default ChoroplethMap;
