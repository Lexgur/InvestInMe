import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./RegisterPage.css";
import * as C from "./constants.js";
import Logo from "./Logo.jsx";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !username) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(C.URL + C.REGISTER_PAGE, {
        email,
        password,
        username,
      });

      setSuccessMessage(response.data.message);
      setErrorMessage("");
      setEmail("");
      setPassword("");
      setUsername("");
    } catch (err) {
      setErrorMessage("Error registering user.");
      console.error(err);
    }
  };

  return (
    <div className="wrapper">
    <div className="container">
      <div className="investLogoContainer">
      <Link to='/'><Logo /></Link>
      </div>
      <h2>Welcome</h2>
      <p>
        Register to InvestInMe or <Link to="/login">Sign in</Link> with an
        existing account.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <input
            placeholder="Email adress"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="formGroup">
          <input
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit" className="submitButton">
          Register
        </button>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>
    </div>
    </div>
  );
}

export default RegisterPage;
