import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { statesData } from './us-states'; 
const config = require('../config.json');

function ChoroplethMap({ onDataLoaded, onStateClick }) {
  const [covidData, setCovidData] = useState({});
  const infoRef = useRef(null);
  const [currentInfo, setCurrentInfo] = useState(null); // 用于存储当前显示的信息

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/covid-data`)
      .then(response => response.json())
      .then(data => {
        // 创建映射表
        const dataMap = data.reduce((acc, item) => {
          acc[item.state] = item;
          return acc;
        }, {});
        setCovidData(dataMap); // 存储为映射表形式
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
        this._div = L.DomUtil.create('div', 'info'); // 创建一个div来显示信息
        this.update();
        return this._div;
      };

      info.update = function (props) {
        this._div.innerHTML = '<h4>COVID-19 Data</h4>' + (props ?
          '<b>' + props.name + '</b><br />Cases: ' + props.cases + '<br />Deaths: ' + props.deaths :
          'Hover over a state');
      };

      info.addTo(map);
      infoRef.current = info;

      return () => {
        info.remove(); // 在组件卸载时移除控件
      };
    }, [map]);

    useEffect(() => {
      if (infoRef.current) {
        infoRef.current.update(currentInfo); // 更新当前显示的信息
      }
    }, [currentInfo]);

    return null;
  };

  const defaultStyle = {
    fillColor: '#FFFFFF',
    weight: 2,
    color: 'white',
    dashArray: '',
    fillOpacity: 0.7,
    opacity: 1
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
    const stateInfo = covidData[feature.properties.name];
    const isHighlighted = currentInfo && feature.properties.name === currentInfo.name;
    return {
      fillColor: stateInfo ? getColor(stateInfo.cases) : '#FFFFFF',
      weight: isHighlighted ? 5 : 2,
      color: isHighlighted ? '#666' : 'white',
      dashArray: '',
      fillOpacity: isHighlighted ? 0.8 : 0.7,
      opacity: 1
    };
  }, [covidData, currentInfo]);

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        const stateInfo = covidData[feature.properties.name]; // 直接通过键访问
        layer.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.8
        });
        layer.bringToFront();
        if (infoRef.current) {
          const info = stateInfo ? { ...feature.properties, cases: stateInfo.cases, deaths: stateInfo.deaths } : feature.properties;
          setCurrentInfo(info); // 更新当前信息
          infoRef.current.update(info);
        }
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(geoJsonStyle(feature)); // 重置为初始样式
      },
      click: () => {
        const stateName = feature.properties.name;
        onStateClick(stateName); // 调用回调函数传递州名
      }
    });
  };

  return covidData && Object.keys(covidData).length > 0 ? (
    <MapContainer center={[37.8, -96]} zoom={4} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeoJSON data={statesData} style={geoJsonStyle} onEachFeature={onEachFeature} />
      <InfoControl />
    </MapContainer>
  ) : <p>Loading data...</p>;
}

export default ChoroplethMap;
