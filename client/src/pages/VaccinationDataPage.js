import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
const config = require('../config.json');

dayjs.extend(isBetween);

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
        const chartDom = document.getElementById('main');
        const myChart = echarts.init(chartDom);
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
    </div>
  );
};

export default VaccinationDataPage;