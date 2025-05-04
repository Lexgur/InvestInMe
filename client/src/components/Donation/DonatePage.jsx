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
        campaign_id: id,
        amount: parseFloat(amount),
      }, { withCredentials: true });
      navigate(`/public-campaign/${id}`);
    } catch (err) {
      console.error(err);
      setError('Failed to donate');
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!campaign) return <div><Loader></Loader></div>;

  return (
    <div className="donate-page-container">
      <h2>Donate to: {campaign.name}</h2>
      <input
        type="number"
        placeholder="Enter amount (€)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleDonate} disabled={!amount}>Donate</button>
    </div>
  );
}
