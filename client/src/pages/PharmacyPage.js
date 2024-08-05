import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Slider, TextField,  Divider, Link } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { formatDuration } from '../helpers/formatter';
import { DataGrid } from '@mui/x-data-grid';
import { NavLink } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';


import LazyTable from '../components/LazyTable';
const config = require('../config.json');

export default function Pharmacy() {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  // TODO (TASK 13): add a state variable to store the app author (default to '')
  const [author, setAuthor] = useState("");

  const [selectedState, setSelectedState] = useState('');
  const [state_name, setStateName] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [longitude, setLongitude] = useState([-177, 146]);
  const [latitude, setLatitude] = useState([13, 72]);



  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);



  // The useEffect hook by default runs the provided callback after every render
  // The second (optional) argument, [], is the dependency array which signals
  // to the hook to only run the provided callback if the value of the dependency array
  // changes from the previous render. In this case, an empty array means the callback
  // will only run on the very first render.
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/author/name`)
    .then(res => res.text())
    .then(resText => setAuthor(resText));

  }, []);

  useEffect(() => {
    if (state_name) {
      // setSelectedCity('');
      setCities([]);
      search_city();
    } else {
      setCities([]);
    }
  }, [state_name]);

  // useEffect(() => {

  //     fetch(`http://${config.server_host}:${config.server_port}/pharmacy_selectCity?state_name=${state_name}`)
  //     .then(res => res.json())
  //     .then(resJson => setCities(resJson));
      
  //   },[state_name]);



  // useEffect(() => {
  //   fetch(`http://${config.server_host}:${config.server_port}/pharmacy_search`)
  //   .then(res => res.json())
  //   .then(resJson => {
  //     console.log("Received data:", resJson);
  //     const pharmacyWithID = resJson.map((pharmacy) => ({id: pharmacy.store_id, ...pharmacy }));
  //     console.log("Processed data for setting state:", pharmacyWithID);
  //     setData(pharmacyWithID);

  //   });
  // }, [])

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/pharmacy_search?state_name=${state_name}` + 
       `&city_name=${selectedCity}` +
       `&longitude_low=${longitude[0]}&longitude_high=${longitude[1]}` + 
       `&latitude_low=${latitude[0]}&latitude_high=${latitude[1]}` 
    )
      .then(res => res.json())
      .then(resJson => {
        console.log("Received data:", resJson);
        console.log("city is: ", selectedCity);
        console.log("longitude is: ", longitude[0]);
        console.log("latitude is: ", latitude[0]);
        const pharmacyWithID = resJson.map((pharmacy) => ({id: pharmacy.store_id, ...pharmacy }));
        console.log("Processed data for setting state:", pharmacyWithID);
        setData(pharmacyWithID);
      });
  }

  const search_city = () => {
 
    fetch(`http://${config.server_host}:${config.server_port}/pharmacy_selectCity?state_name=${state_name}`
     
    )
    .then(res => res.json())
    .then(resJson => setCities(resJson.map(city => city.city)));
    
  }

  

  

  // Here, we define the columns of the "Top Songs" table. The songColumns variable is an array (in order)
  // of objects with each object representing a column. Each object has a "field" property representing
  // what data field to display from the raw data, "headerName" property representing the column label,
  // and an optional renderCell property which given a row returns a custom JSX element to display in the cell.

  const pharmacy_general_info_column = [
    {
      field: 'loc_name',
      headerName: 'provider name',
      // renderCell: (row) => <Link onClick={() => setSelectedSongId(row.song_id)}>{row.title}</Link> // A Link component is used just for formatting purposes
    },
    {
      field: 'city',
      headerName: 'provider city',
      // renderCell: (row) => <NavLink to={`/albums/${row.album_id}`}>{row.album}</NavLink> // A NavLink component is used to create a link to the album page
    },
    {
      field: 'state',
      headerName: 'provider state',
    },
    {
      field: 'med_names',
      headerName: 'provider meds',
    },
    {
      field: 'category',
      headerName: 'med category',
    },
    {
      field: 'longitude',
      headerName: 'provider longitude',
    },
    {
      field: 'latitude',
      headerName: 'provider latitude',
    },
 
  ];




  const pharmacy_store_column = [
    {
      field: 'state',
      headerName: 'state name',
      // renderCell: (row) => <Link onClick={() => setSelectedSongId(row.song_id)}>{row.title}</Link> // A Link component is used just for formatting purposes
    },
    {
      field: 'provider_count',
      headerName: 'provider count',
      // renderCell: (row) => <NavLink to={`/albums/${row.album_id}`}>{row.album}</NavLink> // A NavLink component is used to create a link to the album page
    },
 
  ];

  // TODO (TASK 15): define the columns for the top albums (schema is Album Title, Plays), where Album Title is a link to the album page
  // Hint: this should be very similar to songColumns defined above, but has 2 columns instead of 3
  // Hint: recall the schema for an album is different from that of a song (see the API docs for /top_albums). How does that impact the "field" parameter and the "renderCell" function for the album title column?
  const vaccination_column = [
    {
      field: 'state_name',
      headerName: 'state name',
      // renderCell: (row) => <NavLink to={`/albums/${row.album_id}`}>{row.title}</NavLink>
    },
    {
      field: 'total_fully_vaccinated',
      headerName: 'total vaccine count'
    }

  ]

  return (
    <Container>
      <h2>Pharmacy Provider General Info</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/pharmacy`} columns={pharmacy_general_info_column} />
      <Divider />
      <h2>Pharmacy Store Count</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/pharmacy_store_count`} columns={pharmacy_store_column} />
      <Divider />
      {/* TODO (TASK 16): add a h2 heading, LazyTable, and divider for top albums. Set the LazyTable's props for defaultPageSize to 5 and rowsPerPageOptions to [5, 10] */}
      <h2>Fully Vaccination Count</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/fully_vaccination_count`} columns={vaccination_column} defaultPageSize={5} rowsPerPageOptions={[5, 10]} />
      <Divider />

      {/* //slide bar */}
      <h2>Search Locations</h2>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <TextField label='enter a state' value={state_name} onChange={(e) => setStateName(e.target.value)} style={{ width: "100%" }}/>
        </Grid>    
      </Grid>
      
      {/* dropdown manual */}   
        <div>
        {/* <FormControl fullWidth>
          <InputLabel id="state-select-label">State</InputLabel>
          <Select
            labelId="state-select-label"
            id="state-select"
            value={selectedState}
            label="State"
            onChange={e => setSelectedState(e.target.value)}
          >
            {states.map(state => (
              <MenuItem key={state} value={state}>{state}</MenuItem>
            ))}
          </Select>
        </FormControl> */}

        <FormControl fullWidth style={{width: '200px'}} disabled={!cities.length}>
          <InputLabel id="city-select-label">City</InputLabel>
          <Select
            labelId="city-select-label"
            id="city-select"
            value={selectedCity}
            label="City"
            onChange={e => setSelectedCity(e.target.value)}
            size="small"
          >
            {cities.map((city, index) => (
              // <MenuItem key={city} value={city}>{city}</MenuItem>
              <MenuItem key={index} value={city} sx={{ fontSize: '0.875rem', padding: '6px 10px' }}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        </div>

        <Grid item xs={3}>
          <p>Longitude</p>
          <Slider
            value={longitude}
            onChange={(e, newValue) => setLongitude(newValue)}
            valueLabelDisplay='auto'
            min={-177}
            max={146}
            step={10}
            sx={{
              width: 300, // Adjust the width of the slider
              '& .MuiSlider-thumb': {
                height: 24, // Height of the thumb
                width: 24, // Width of the thumb
                backgroundColor: '#f50057', // Change thumb color
              },
              '& .MuiSlider-track': {
                height: 8, // Height of the track
                backgroundColor: '#f50057', // Change track color
              },
              '& .MuiSlider-rail': {
                height: 8, // Height of the rail (part of the track that is not filled)
                backgroundColor: 'grey', // Change rail color
              }
            }}   
          />
        </Grid>

        <Grid item xs={3}>
          <p>latitude</p>
          <Slider
            value={latitude}
            onChange={(e, newValue) => setLatitude(newValue)}
            valueLabelDisplay='auto'
            min={13}
            max={72}
            step={10}
            sx={{
              width: 300, // Adjust the width of the slider
              '& .MuiSlider-thumb': {
                height: 24, // Height of the thumb
                width: 24, // Width of the thumb
                backgroundColor: '#f50057', // Change thumb color
              },
              '& .MuiSlider-track': {
                height: 8, // Height of the track
                backgroundColor: '#f50057', // Change track color
              },
              '& .MuiSlider-rail': {
                height: 8, // Height of the rail (part of the track that is not filled)
                backgroundColor: 'grey', // Change rail color
              }
            }}     
          />
        </Grid>

      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>


      <h2>Results</h2>
      <DataGrid
        rows={data}
        columns={pharmacy_general_info_column}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
        getRowId={(row) => row.store_id}
      />

      
        
      <p>{author}</p>

    </Container>
    
  );

};