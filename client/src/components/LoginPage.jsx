import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.css';
import * as C from './constants.js';
import Logo from './Logo.jsx';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Both fields are required.");
      return;
    }

    try {
      const response = await axios.post(C.URL + C.LOGIN_PAGE, {
        email,
        password,
      });

      alert(response.data.message);
    } catch (err) {
      setErrorMessage("Invalid credentials or server error.");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className='investLogoContainer'>
        <Logo />
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
  );
}

export default LoginPage;
