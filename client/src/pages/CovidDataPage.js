import React, { useState } from 'react';
import ChoroplethMap from '../components/ChoroplethMap'; // 确保路径正确
import { Container, Box, Typography, Grid, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import Footer from '../components/Footer';
import CountyDataViewer from '../components/CountyDataViewer';

function CovidData() {
  const [covidSummary, setCovidSummary] = useState({ totalCases: 0, totalDeaths: 0 });
  const [selectedState, setSelectedState] = useState('');

  const handleDataLoaded = (summary) => {
    setCovidSummary(summary);
  };

  const handleStateClick = (stateName) => {
    setSelectedState(stateName);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ marginTop: 3, marginBottom: 5 }}>
        <div>
          <h1 className="header">United States COVID Tracker</h1>
          <p className="subtitle">Last updated on July 25, 2024</p>
        </div>
        <ChoroplethMap onDataLoaded={handleDataLoaded} onStateClick={handleStateClick} />
      </Box>

      <Box sx={{ marginTop: 5, marginBottom: 5 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                Key Statistics
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Total Cases" secondary={covidSummary.totalCases.toLocaleString()} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Total Deaths" secondary={covidSummary.totalDeaths.toLocaleString()} />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                Preventive Measures
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Wear a mask" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Wash your hands regularly" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Get vaccinated" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <CountyDataViewer selectedState={selectedState} />

      <Footer />
    </Container>
  );
}

export default CovidData;
