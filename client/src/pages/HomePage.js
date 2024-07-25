import React from 'react';
import { Container, Box, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import MapComponent from '../components/MapComponent';


export default function HomePage() {
  const testData = [
    { "country": "United States", "lat": 37.0902, "long": -95.7129, "cases": 50000000, "deaths": 800000 },
    { "country": "Brazil", "lat": -14.2350, "long": -51.9253, "cases": 22000000, "deaths": 610000 },
    { "country": "India", "lat": 20.5937, "long": 78.9629, "cases": 34000000, "deaths": 450000 },
    { "country": "France", "lat": 46.2276, "long": 2.2137, "cases": 7000000, "deaths": 110000 },
    { "country": "United Kingdom", "lat": 55.3781, "long": -3.4360, "cases": 10000000, "deaths": 130000 }
  ];

  const infoCards = [
    {
      title: 'Masks',
      description: 'Wearing a mask is advisable if the risk level in your community is high, you have recently been in contact with someone with COVID, or a healthcare professional has recommended it based on your personal risk factors.',
      buttonText: 'Get tips on masking',
      link: '#',
      icon: '😷'
    },
    {
      title: 'Testing',
      description: 'It’s crucial to get tested if you exhibit symptoms or have been exposed to COVID. The Test to Treat initiative ensures high-risk individuals receive immediate antiviral treatment upon testing positive.',
      buttonText: 'Order free at-home tests',
      link: '#',
      icon: '🧪'
    },
    {
      title: 'Vaccines',
      description: 'Vaccinations are now available for children aged 6 months and older. Getting vaccinated can help protect against infection, severe illness, and death caused by COVID.',
      buttonText: 'Find a vaccine',
      link: '#',
      icon: '💉'
    },
    {
      title: 'Booster shots',
      description: 'Booster shots provide essential protection against COVID variants, reducing the risk of infection and severe illness. The updated 2023/2024 booster offers enhanced protection.',
      buttonText: 'Find a booster',
      link: '#',
      icon: '💉'
    }
  ];

  return (
    <Container maxWidth="lg">
      <div>
        <h1 className="header">COVID Tracker</h1>
        <p className="subtitle">Last updated on July 25, 2024</p>
      </div>
      <Box sx={{ marginTop: 3 }}>
        <MapComponent data={testData} />
      </Box>
      <Box sx={{ marginTop: 5 }}>
        <h2 className="recommendation-title">Recommendations</h2>
        <Grid container spacing={3}>
          {infoCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card className="card">
                <CardContent className="card-content">
                  <h3 className="card-title">{card.icon} {card.title}</h3>
                  <p className="card-description">{card.description}</p>
                </CardContent>
                <CardActions>
                  <Button size="small" href={card.link}>
                    {card.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
