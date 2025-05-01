import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './components/RegisterPage'; 
import './App.css';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<RegisterPage />} />
        </Routes>
    </Router>
  );
}

export default App;
