import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

function NavText({ href, text, IconComponent }) {
  const linkStyle = {
    fontFamily: 'Dosis, sans-serif',
    color: 'inherit',
    textDecoration: 'none',
    transition: 'color 0.3s, background-color 0.3s',
    padding: '15px',
    borderRadius: '0px',
    display: 'flex', // 确保内容垂直居中
    alignItems: 'center', // 内容垂直居中
    height: '100%', // 链接填满整个高度
    boxSizing: 'border-box' // 确保padding计算在内
  };

  const hoverStyle = {
    color: '#ffffff',
    backgroundColor: '#000000',
    borderRadius: '0px'
  };

  return (
    <Typography variant="h6" noWrap component="div" style={{ display: 'flex', alignItems: 'center' }}>
      <NavLink
        to={href}
        style={linkStyle}
        onMouseEnter={e => {
          Object.assign(e.currentTarget.style, hoverStyle);
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'inherit';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {IconComponent && <IconComponent style={{ marginRight: '8px' }} />}
        {text}
      </NavLink>
    </Typography>
  );
}

export default function NavBar() {
  return (
    <AppBar position="static" style={{ background: '#333' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters style={{ height: '64px', display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1, display: 'flex', height: '100%' }}>
            <NavText href="/" IconComponent={HomeIcon} />
            <NavText href="/pharmacy" text="Pharmacy" />
            <NavText href="/covid-data" text="COVID Data" />
            <NavText href="/vaccination" text="Vaccination Data" />
          </Box>
          <Box sx={{ flexGrow: 0, display: 'flex', height: '100%' }}>
            <NavText href="/login" text="Login" />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
