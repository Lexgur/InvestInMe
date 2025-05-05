import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/useAuth';
import axios from 'axios';
import * as C from '../constants';
import Loader from '../Loader';
import './MyCampaignPage.css';

export default function MyCampaignsPage() {
  const { user, loading } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (user) {
        try {
          const fullUrl = C.URL + C.MY_CAMPAIGNS;
          const response = await axios.get(fullUrl, { withCredentials: true });
          if (response.data.success) {
            setCampaigns(response.data.campaigns);
          } else {
            setError('No campaigns found.');
          }
        } catch (err) {
          setError('Error fetching campaigns');
          console.error(err);
        }
      }
    };

    if (!loading && user) {
      fetchCampaigns();
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="loader-container">
        <Loader />
      </div>
    );
  }

  return (
    <div className="my-campaigns-container">
      <h1>My Campaigns</h1>
      {error && <div className="error">{error}</div>}
      {campaigns.length === 0 ? (
        <p>No campaigns to display</p>
      ) : (
        <div className="campaigns-grid">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="campaign-card">
              {campaign.image_url && (
                <img
                  src={campaign.image_url}
                  alt={campaign.name}
                  className="campaign-image"
                />
              )}
              <div className="campaign-content">
                <h2 className='campaign-name'>{campaign.name}</h2>
                <p className={`campaign-status ${campaign.approved ? 'approved' : 'pending'}`}>
                  Status: {campaign.approved ? 'Approved' : 'Pending'}
                </p>
                <div className="progress-section">
                  <div className="progress-text">
                    €{campaign.collected.toLocaleString()} raised of €
                    {campaign.goal.toLocaleString()}
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(
                          (campaign.collected / campaign.goal) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <a
                  href={`/campaign/${campaign.id}`}
                  className="view-campaign-link"
                >
                  View Campaign
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}