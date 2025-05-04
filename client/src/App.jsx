import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './style/loader.scss'
import RegisterPage from './components/Auth/RegisterPage';
import { AuthProvider } from './components/Auth/AuthContext';
import './App.css';
import LoginPage from './components/Auth/LoginPage';
import LogoutPage from './components/Auth/LogoutPage';
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';
import NavAll from './components/NavAll';
import NewCampaignPage from './components/Campaign/NewCampaignPage';
import MyCampaignsPage from './components/Campaign/MyCampaignsPage';
import AdminPanel from './components/AdminPanel';

function App() {
  
  return (
    <Router>
      <AuthProvider>
        <NavAll />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/campaigns/new" element={<NewCampaignPage />} />
          <Route path="/my-campaigns" element={<MyCampaignsPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;