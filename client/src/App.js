import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline } from '@mui/material';
import Container from '@mui/material/Container';

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import PharmacyPage from './pages/PharmacyPage';

// App is the root component of our application
export default function App() {
  return (
    <BrowserRouter>
      <CssBaseline /> 
      <NavBar />
      <Routes>
        <Route path="/"  element={<HomePage />} />
        <Route path="/pharmacy" element={<PharmacyPage />} />
        {/* More routes can be added here */}
      </Routes>
    </BrowserRouter>
  );
}
