import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './style/loader.scss'
import RegisterPage from './components/RegisterPage';
import { AuthProvider } from './components/AuthContext';
import './App.css';
import LoginPage from './components/LoginPage';
import LogoutPage from './components/LogoutPage';
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';
import NavAll from './components/NavAll';

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
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;