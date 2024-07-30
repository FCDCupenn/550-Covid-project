import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import PharmacyPage from './pages/PharmacyPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import VaccinationDataPage from './pages/VaccinationDataPage';

import { Toaster } from 'react-hot-toast';

// App is the root component of our application
export default function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pharmacy" element={<PharmacyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/vaccination" element={<VaccinationDataPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
