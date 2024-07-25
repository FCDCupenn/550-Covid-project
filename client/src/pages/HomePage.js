import React, { useEffect, useState } from 'react';
import { Container, Divider } from '@mui/material';
import MapComponent from '../components/MapComponent'; 

export default function HomePage() {
  const testData = [
    { lat: 51.505, long: -0.09, cases: 10000, deaths: 500 },
    { lat: 48.8566, long: 2.3522, cases: 20000, deaths: 1000 }
  ];

  return (
    <div>
      <h1>COVID-19 Map</h1>
      <MapComponent data={testData} />
    </div>
  );
};
