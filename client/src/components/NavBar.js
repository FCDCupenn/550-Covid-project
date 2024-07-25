import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

// Helper component for navigation text to avoid repeated code
function NavText({ href, text, isMain }) {
  const linkStyle = {
    color: 'inherit',
    textDecoration: 'none',
    transition: 'color 0.3s, background-color 0.3s',  // Ensuring background color also transitions smoothly
    padding: '10px',  // Adding some padding for better visual appearance
    borderRadius: '10px',  // Rounded corners
  };

  const hoverStyle = {
    color: '#ffeb3b',
    backgroundColor: '#1976d2'  // Blue background on hover
  };

  const activeStyle = {
    color: '#f44336',  // Red text when active
    backgroundColor: '#1565c0'  // Darker blue background when active
  };

  return (
    <Typography
      variant={isMain ? 'h6' : 'h6'}
      noWrap
      style={{
        marginRight: '20px',
        fontFamily: 'Times New Roman',
        fontWeight: 700,
        letterSpacing: '0rem',
      }}
    >
      <NavLink
        to={href}
        style={linkStyle}
        activeStyle={activeStyle}
        onMouseEnter={e => {
          e.target.style.color = hoverStyle.color;
          e.target.style.backgroundColor = hoverStyle.backgroundColor;  // Applying background color on hover
        }}
        onMouseLeave={e => {
          e.target.style.color = linkStyle.color;
          e.target.style.backgroundColor = 'transparent';  // Resetting background color on mouse leave
        }}
      >
        {text}
      </NavLink>
    </Typography>
  );
}

// NavBar component with hover and active styles
export default function NavBar() {
  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex' }}> 
            <NavText href='/' text='Home' isMain />
            <NavText href='/pharmacy' text='Pharmacy' />
            <NavText href='/covid-data' text='COVID Data' />
            <NavText href='/vaccination' text='Vaccination' />
          </Box>
          <Box sx={{ flexGrow: 0, display: 'flex' }}>  
            <NavText href='/login' text='login' />
            <NavText href='/register' text='register' />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
