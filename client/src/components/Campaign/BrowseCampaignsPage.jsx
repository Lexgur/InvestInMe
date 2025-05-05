import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as C from '../constants';
import { NavLink } from 'react-router-dom';
import './BrowseCampaignsPage.css';
import Loader from '../Loader';

export default function BrowseCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get(`${C.URL}campaigns/`);
        if (response.data.success) {
          setCampaigns(response.data.campaigns);
        } else {
          setError('Failed to load campaigns');
        }
      } catch (err) {
        setError('Server error');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) return <p><Loader /></p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="browse-campaigns">
      <h1>Browse Campaigns</h1>
      {campaigns.length === 0 ? (
        <p>No campaigns available.</p>
      ) : (
        <div className="campaign-list">
          {[...campaigns]
            .sort((a, b) => {
              const aFullyFunded = a.collected >= a.goal;
              const bFullyFunded = b.collected >= b.goal;
              return aFullyFunded - bFullyFunded;
            })
            .map(campaign => (
              <div key={campaign.id} className="campaign-card">
                <h2>{campaign.name}</h2>
                {campaign.image_url && <img src={campaign.image_url} alt={campaign.name} />}
                <div className="progress-section">
                  <div className="progress-text">
                    €{campaign.collected.toLocaleString()} raised of €
                    {campaign.goal.toLocaleString()}
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min((campaign.collected / campaign.goal) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <NavLink to={`/public/campaign/${campaign.id}`} className="view-button-navlink">
                  View Campaign
                </NavLink>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}