import React, { useState, useEffect } from 'react';
import { MenuItem, Select, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function CountyDataViewer({ selectedState }) {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStateFromDropdown, setSelectedStateFromDropdown] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/covid-data-county');
        const data = await response.json();
        setAllData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const state = selectedState || selectedStateFromDropdown;
    if (state) {
      const filtered = allData.filter(item => item.state_name === state);
      setFilteredData(filtered);
    }
  }, [selectedState, selectedStateFromDropdown, allData]);

  // 更新下拉框的选择状态，不影响用户自己选择的操作
  useEffect(() => {
    if (selectedState) {
      setSelectedStateFromDropdown(selectedState);
    }
  }, [selectedState]);

  const handleStateChange = (event) => {
    setSelectedStateFromDropdown(event.target.value);
  };

  return (
    <div>
      <FormControl fullWidth style={{ margin: 10 }}>
        <InputLabel id="state-select-label">State</InputLabel>
        <Select
          labelId="state-select-label"
          id="state-select"
          value={selectedStateFromDropdown}
          label="State"
          onChange={handleStateChange}
        >
          {[...new Set(allData.map(item => item.state_name))].map(state => (
            <MenuItem key={state} value={state}>{state}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TableContainer component={Paper} style={{ margin: 10 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>County Name</TableCell>
              <TableCell align="right">Total Average Cases</TableCell>
              <TableCell align="right">Total Average Deaths</TableCell>
              <TableCell align="right">Recent Cases Avg</TableCell>
              <TableCell align="right">Recent Deaths Avg</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.county_name}>
                <TableCell component="th" scope="row">
                  {row.county_name}
                </TableCell>
                <TableCell align="right">{row.total_avg_cases}</TableCell>
                <TableCell align="right">{row.total_avg_deaths}</TableCell>
                <TableCell align="right">{row.recent_cases_avg}</TableCell>
                <TableCell align="right">{row.recent_deaths_avg}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default CountyDataViewer;
