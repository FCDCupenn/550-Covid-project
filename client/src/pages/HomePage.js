import React, { useEffect, useState } from 'react';
import { Container, Divider } from '@mui/material';
import MapComponent from '../components/MapComponent'; 

export default function HomePage() {
  const [covidData, setCovidData] = useState([]);

  useEffect(() => {
    // 假设您有API获取数据
    fetch('https://api.example.com/covid_data')
      .then(response => response.json())
      .then(data => setCovidData(data));
  }, []);

  return (
    <Container>
      <h2>Global COVID-19 Data</h2>
      <MapComponent data={covidData} />
      <Divider />
      {/* 其他组件内容 */}
    </Container>
  );
};
