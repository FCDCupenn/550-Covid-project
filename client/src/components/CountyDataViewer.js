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
              <TableCell>State Name</TableCell>
              <TableCell>Total Average Cases</TableCell>
              <TableCell>Total Average Deaths</TableCell>
              <TableCell>Recent Cases Avg</TableCell>
              <TableCell>Recent Deaths Avg</TableCell>
              <TableCell>Cases</TableCell>
              <TableCell>Deaths</TableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.county_name}>
                <TableCell component="th" scope="row">
                  {row.county_name}
                </TableCell>
                <TableCell>{row.state_name}</TableCell>
                <TableCell>{row.total_avg_cases}</TableCell>
                <TableCell>{row.total_avg_deaths}</TableCell>
                <TableCell>{row.recent_cases_avg}</TableCell>
                <TableCell>{row.recent_deaths_avg}</TableCell>
                <TableCell>{row.cases}</TableCell>
                <TableCell>{row.deaths}</TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default CountyDataViewer;
