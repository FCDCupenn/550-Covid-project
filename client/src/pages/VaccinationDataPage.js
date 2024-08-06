import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box, Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
const config = require('../config.json');

dayjs.extend(isBetween);

const infoCards = [
  {
    title: 'PMC Vaccines Intro',
    description: 'Different types of vaccines are designed to stimulate your immune system and fight against the novel coronavirus. Based on the best approach and technology available in the production of vaccines, scientists will determine their type..',
    buttonText: 'Check Here',
    link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8426786/',
    icon: '📊'
  },
  {
    title: 'Global Vaccine Action Plan',
    description: 'The Global Vaccine Action Plan (GVAP) ― endorsed by the 194 Member States of the World Health Assembly in May 2012 ― is a framework to prevent millions of deaths by 2020 through more equitable access to existing vaccines for people in all communities..',
    buttonText: 'Know More',
    link: 'https://www.who.int/teams/immunization-vaccines-and-biologicals/strategies/global-vaccine-action-plan',
    icon: '💉'
  },
  {
    title: 'What You Need To Know',
    description: 'The COVID-19 vaccine is very good at preventing serious illness, hospitalization and death. Because the virus that causes COVID-19 continues to change, vaccines are updated to help fight the disease.',
    buttonText: 'See It',
    link: 'https://www.hopkinsmedicine.org/health/conditions-and-diseases/coronavirus/covid-19-vaccine-what-you-need-to-know',
    icon: '💉'
  },
  {
    title: 'Register with Us',
    description: 'Stay connected and receive the latest updates and information about COVID-19. Register with us to get personalized alerts and resources to keep you and your community safe. We will provide all the information matters',
    buttonText: 'Register now',
    link: '/login',
    icon: '📝'
  }
];

const VaccinationDataPage = () => {
  const [data, setData] = useState([]);
  const [countryName, setCountryName] = useState([]);
  const [params, setParams] = useState({
    name: '',
    picker: null,
  });

  const getOptions = (payload = []) => {
    const filteredPayload = payload.filter(v =>
      v.total_vaccinations > 0 || v.people_vaccinated > 0 || v.people_fully_vaccinated > 0
    );

    return {
      title: {
        text: 'Total People'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['total_vaccinations', 'people_fully_vaccinated', 'people_vaccinated']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: filteredPayload.map(v => dayjs(v.vaccination_date).format('YYYY-MM-DD')),
        axisLabel: {
          formatter: function (value) {
            return dayjs(value).format('YYYY-MM-DD');
          }
        }
      },
      yAxis: {
        type: 'log',
        logBase: 10,
        axisLabel: {
          formatter: function (value) {
            return value >= 1000000 ? `${(value / 1000000).toFixed(2)}M` : value;
          }
        }
      },
      series: [
        {
          name: 'total_vaccinations',
          type: 'line',
          stack: 'Total',
          data: filteredPayload.map(v => v.total_vaccinations)
        },
        {
          name: 'people_fully_vaccinated',
          type: 'line',
          stack: 'Total',
          data: filteredPayload.map(v => v.people_fully_vaccinated)
        },
        {
          name: 'people_vaccinated',
          type: 'line',
          stack: 'Total',
          data: filteredPayload.map(v => v.people_vaccinated)
        },
      ]
    };
  };

  useEffect(() => {
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);
    myChart.setOption(getOptions([])); // Set an initial empty chart configuration

    fetch(`http://${config.server_host}:${config.server_port}/vaccination_date`)
      .then(res => res.json())
      .then(resText => {
        const data = resText.map(v => ({
          ...v,
          date: dayjs(v.vaccination_date).valueOf()
        }));
        setData(resText);
        const countryName = [...new Set(data?.map(v => v.country_name))];
        setCountryName(countryName);
        setParams(prevParams => ({
          ...prevParams,
          name: countryName[0]
        }));
        const currentData = data?.filter(v => v.country_name === countryName[0]);
        myChart.setOption(getOptions(currentData));
      });
  }, []);

  useEffect(() => {
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);
    if (params?.name && params?.picker) {
      const [start, end] = params?.picker;
      const currentData = data?.filter(v =>
        v.country_name === params?.name && dayjs(v.vaccination_date).isBetween(dayjs(start), dayjs(end))
      );
      myChart.setOption(getOptions(currentData));
      return;
    }
    if (params?.name) {
      const currentData = data?.filter(v => v.country_name === params?.name);
      myChart.setOption(getOptions(currentData));
      return;
    }
    if (params?.picker) {
      const [start, end] = params?.picker;
      const currentData = data?.filter(v =>
        dayjs(v.vaccination_date).isBetween(dayjs(start), dayjs(end))
      );
      myChart.setOption(getOptions(currentData));
      return;
    }
  }, [params]);

  return (
    <div>
      <div style={{ display: 'flex', margin: '20px 10px' }}>
        <div style={{ flex: 1 }}>
          <FormControl style={{ width: '90%' }}>
            <InputLabel id="demo-simple-select-label">Country</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={params.name}
              onChange={(e) => {
                const value = e.target.value;
                setParams(prevParams => ({
                  ...prevParams,
                  name: value
                }));
              }}
            >
              {countryName?.map(v => (
                <MenuItem value={v} key={v}>{v}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div style={{ flex: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              value={params.picker}
              onChange={(val) => {
                setParams(prevParams => ({
                  ...prevParams,
                  picker: val
                }));
              }}
              minDate={dayjs('2021-01-01')}
              maxDate={dayjs('2022-12-31')}
              renderInput={(startProps, endProps) => (
                <>
                  <TextField {...startProps} placeholder="Start Date" value={params.picker ? startProps.inputProps.value : ''} />
                  <Box sx={{ mx: 2 }}> to </Box>
                  <TextField {...endProps} placeholder="End Date" value={params.picker ? endProps.inputProps.value : ''} />
                </>
              )}
            />
          </LocalizationProvider>
        </div>
      </div>
      <div id="main" style={{ height: '500px', width: '95%', margin: '0 auto' }}></div>
      <div style={{ width: '95%', margin: '20px auto' }}>
        <Typography variant="h5" component="h2" style={{ marginBottom: '20px' }}>
          Related Websites
        </Typography>
        <Grid container spacing={2}>
          {infoCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card style={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {card.icon} {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" style={{ margin: '10px 0' }}>
                    {card.description}
                    </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => window.open(card.link, '_blank')}
                  >
                    {card.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default VaccinationDataPage;