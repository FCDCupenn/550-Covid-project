import React , { useState, useEffect }from 'react';
import { Container, Box, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import MapComponent from '../components/MapComponent';
import Footer from '../components/Footer';
import CountyDataViewer from '../components/CountyDataViewer';

const config = require('../config.json');

export default function HomePage() {
  // 设置状态来存储从 API 获取的数据
  const [covidData, setCovidData] = useState([]);
  const [author, setAuthor] = useState("");

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

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/author/name`)
    .then(res => res.text())
    .then(resText => setAuthor(resText));

  }, []);

  const infoCards = [
    {
      title: 'Go See US Data',
      description: 'Stay updated with the latest COVID-19 statistics and trends in the United States. Regularly check the data to understand the current situation and make informed decisions.',
      buttonText: 'View US Data',
      link: '/covid-data',  
      icon: '📊'
    },
    {
      title: 'Vaccines',
      description: 'Vaccinations are now available for children aged 6 months and older. Getting vaccinated can help protect against infection, severe illness, and death caused by COVID.',
      buttonText: 'Find a vaccine',
      link: '/pharmacy',
      icon: '💉'
    },
    {
      title: 'Booster shots',
      description: 'Booster shots provide essential protection against COVID variants, reducing the risk of infection and severe illness. The updated 2023/2024 booster offers enhanced protection.',
      buttonText: 'Find a booster',
      link: '/pharmacy',
      icon: '💉'
    },
    {
      title: 'Register with Us',
      description: 'Stay connected and receive the latest updates and information about COVID-19. Register with us to get personalized alerts and resources to keep you and your community safe.',
      buttonText: 'Register now',
      link: '/login',  // 请将 '#' 替换为实际的链接
      icon: '📝'
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
      <Footer />
      <p>{author}</p>
    </Container>
    
  );
}
