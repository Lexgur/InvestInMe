import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./NewCampaignPage.css"; 
import * as C from "../constants.js";
import Logo from "../Logo.jsx"

function NewCampaignPage() {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !goal) {
      setErrorMessage("Campaign name and goal are required.");
      return;
    }

    if (isNaN(goal) || goal <= 0) {
      setErrorMessage("Goal must be a positive number.");
      return;
    }

    try {
      const response = await axios.post(
        C.URL + C.NEW_CAMPAIGN,
        { name, goal, imageUrl },
        { withCredentials: true }
      );

      setSuccessMessage(response.data.message);
      setErrorMessage("");
      setName("");
      setGoal("");
      setImageUrl("");

      navigate("/campaigns");
    } catch (err) {
      setErrorMessage("Error creating campaign.");
      console.error(err);
    }
  };

  return (
    <div className="wrapper">
      <div className="container">
        <div className="investLogoContainer">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <h2>Create a New Campaign</h2>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <input
              placeholder="Campaign Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="formGroup">
            <input
              placeholder="Campaign Goal"
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            />
          </div>
          <div className="formGroup">
            <input
              placeholder="Image URL (Optional)"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <button type="submit" className="submitButton cmp-button">
            Create Campaign
          </button>
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default NewCampaignPage;
