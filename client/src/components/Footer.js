import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

function Footer() {
  return (
    <Box sx={{ marginTop: 5, marginBottom: 5 }}>
      <h2 className="recommendation-title">
        Additional Resources
        </h2>
      <List>
        <ListItem>
          <ListItemText primary="CDC COVID-19 Information" secondary="https://www.cdc.gov/coronavirus/2019-ncov/index.html" />
        </ListItem>
        <ListItem>
          <ListItemText primary="WHO COVID-19 Updates" secondary="https://www.who.int/emergencies/diseases/novel-coronavirus-2019" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Johns Hopkins COVID-19 Tracker" secondary="https://coronavirus.jhu.edu/map.html" />
        </ListItem>
      </List>
      <Box sx={{ marginTop: 5, marginBottom: 5 }}>
        <Typography variant="body2" color="textSecondary" align="center">
          © 2024 COVID Tracker. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default Footer;
