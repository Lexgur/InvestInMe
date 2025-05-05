import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as C from '../constants';
import Loader from '../Loader';

export default function DonatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [campaign, setCampaign] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${C.URL}campaigns/${id}`)
      .then(res => {
        if (res.data.success) {
          setCampaign(res.data.campaign);
        } else {
          setError('Campaign not found');
        }
      })
      .catch(() => setError('Error fetching campaign'));
  }, [id]);

  const handleDonate = async () => {
    try {
      await axios.post(`${C.URL}donations/donate`, {
        campaignId: id,
        amount: parseFloat(amount),
      }, { withCredentials: true });
      navigate(`/campaigns`);
    } catch (err) {
      console.error(err);
      setError('Failed to donate');
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!campaign) return <div><Loader></Loader></div>;
  const remainingAmount = campaign.goal - campaign.collected;
  return (
    <div className="donate-page-container">
      <h2>Donate to: {campaign.name}</h2>
  
      <input
        type="number"
        step="0.01"
        min="0.01"
        max={remainingAmount}
        placeholder={`Enter amount (max €${remainingAmount.toFixed(2)})`}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
  
      {/* It will throw an error if the amount is higher than the remainingAmount of the goal */}
      {parseFloat(amount) > remainingAmount && (
        <div className="error">
          Amount exceeds remaining goal (€{remainingAmount.toFixed(2)})
        </div>
      )}
  
      <button
        onClick={handleDonate}
        disabled={
          !amount ||
          parseFloat(amount) <= 0 ||
          parseFloat(amount) > remainingAmount
        }
      >
        Donate
      </button>
    </div>
  );
}
