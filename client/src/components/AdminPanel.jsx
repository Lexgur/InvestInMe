import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as C from './constants';
import Loader from './Loader';
import './Campaign/MyCampaignPage.css'; 

export default function AdminPanel() {
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingCampaigns = async () => {
      try {
        const response = await axios.get(C.URL + C.ADMIN_PANEL, { withCredentials: true });
        if (response.data.success) {
          setPendingCampaigns(response.data.campaigns);
        } else {
          setError('Could not fetch pending campaigns');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching pending campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCampaigns();
  }, []);

  const approveCampaign = async (campaignId) => {
    try {
      const response = await axios.post(`${C.URL}approve/${campaignId}`, {}, { withCredentials: true });
      if (response.data.success) {
        setPendingCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      } else {
        alert('Unable to approve campaign');
      }
    } catch (err) {
      console.error('Approval error:', err);
      alert('Error approving campaign');
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <Loader />
      </div>
    );
  }

  return (
    <div className="my-campaigns-container">
      <h1>Pending Campaigns for Approval</h1>
      {error && <div className="error">{error}</div>}
      {pendingCampaigns.length === 0 ? (
        <p>No pending campaigns.</p>
      ) : (
        <div className="campaigns-grid">
          {pendingCampaigns.map((campaign) => (
            <div key={campaign.id} className="campaign-card">
              {campaign.image_url && (
                <img
                  src={campaign.image_url}
                  alt={campaign.name}
                  className="campaign-image"
                />
              )}
              <div className="campaign-content">
                <h2>{campaign.name}</h2>
                <p className="campaign-status pending">Status: Pending</p>
                <div className="progress-section">
                  <div className="progress-text">
                    €0 raised of €{campaign.goal.toLocaleString()}
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <button
                  onClick={() => approveCampaign(campaign.id)}
                  className="approve-campaign-button"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
