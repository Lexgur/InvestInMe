import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './components/RegisterPage'; 
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <h1>InvestInMe</h1>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
