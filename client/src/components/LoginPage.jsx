import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth.js';
import './RegisterPage.css';
import * as C from './constants.js';
import Logo from './Logo.jsx';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Both fields are required.");
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      setErrorMessage(result.message || "Invalid credentials");
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="wrapper">
    <div className="container">
      <div className='investLogoContainer'>
        <Link to='/'><Logo /></Link>
      </div>
      <h2>Welcome Back</h2>
      <p>Sign in to InvestInMe or <Link to="/register">Register</Link> a new account.</p>
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <input
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="formGroup">
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submitButton">Login</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>
    </div>
    </div>
  );
}

export default LoginPage;
