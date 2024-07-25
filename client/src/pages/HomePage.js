import React, { useEffect, useState } from 'react';
import { Container, Divider } from '@mui/material';
import MapComponent from '../components/MapComponent'; 

export default function HomePage() {
  const testData = [
    { "country": "United States", "lat": 37.0902, "long": -95.7129, "cases": 50000000, "deaths": 800000 },
    { "country": "Brazil", "lat": -14.2350, "long": -51.9253, "cases": 22000000, "deaths": 610000 },
    { "country": "India", "lat": 20.5937, "long": 78.9629, "cases": 34000000, "deaths": 450000 },
    { "country": "France", "lat": 46.2276, "long": 2.2137, "cases": 7000000, "deaths": 110000 },
    { "country": "United Kingdom", "lat": 55.3781, "long": -3.4360, "cases": 10000000, "deaths": 130000 }
  ];

  return (
    <div>
      <h1>COVID-19 Map</h1>
      <MapComponent data={testData} />
    </div>
  );
};
