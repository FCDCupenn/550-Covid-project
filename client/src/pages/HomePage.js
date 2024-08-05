import React , { useState, useEffect }from 'react';
import { Container, Box, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import MapComponent from '../components/MapComponent';

const config = require('../config.json');

export default function HomePage() {
  // 设置状态来存储从 API 获取的数据
  const [covidData, setCovidData] = useState([]);

  // 当组件加载时，发起 API 请求
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/covid-country-data`) // 确保这个 URL 是你的 API 端点
      .then(response => response.json())
      .then(data => {
        setCovidData(data);  // 更新状态
      })
      .catch(error => {
        console.error('Error fetching covid data:', error);
      });
  }, []); // 空数组确保只在组件加载时执行

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
      link: 'vaccination',
      icon: '💉'
    },
    {
      title: 'Booster shots',
      description: 'Booster shots provide essential protection against COVID variants, reducing the risk of infection and severe illness. The updated 2023/2024 booster offers enhanced protection.',
      buttonText: 'Find a booster',
      link: 'vaccination',
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
        <MapComponent data={covidData} />
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
