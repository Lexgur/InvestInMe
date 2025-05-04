import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as C from '../constants';
import Loader from '../Loader';
import './SingleCampaignPage.css';

export default function SingleCampaignPage() {
    const { id } = useParams(); // Campaign ID from the URL
    const navigate = useNavigate();
  
    const [campaign, setCampaign] = useState(null);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchCampaignData = async () => {
        try {
          // Fetch campaign data
          const campaignRes = await axios.get(C.URL + C.CAMPAIGN + id, { withCredentials: true });
          if (campaignRes.data.success) {
            setCampaign(campaignRes.data.campaign);
          } else {
            setError('Campaign not found');
          }
  
          // Fetch donations for the campaign
          const donationsRes = await axios.get(`${C.URL}donations/campaign/${id}`);
          if (donationsRes.data.success) {
            setDonations(donationsRes.data.donations);
          } else {
            setError('Error fetching donations');
          }
        } catch (err) {
          console.error(err);
          setError('Error fetching campaign or donations');
        } finally {
          setLoading(false);
        }
      };
  
      fetchCampaignData();
    }, [id]);
  
    const deleteCampaign = async () => {
      const confirmed = window.confirm("Are you sure you want to delete this campaign?");
      if (!confirmed) return;
  
      try {
        const response = await axios.delete(`${C.URL}admin/delete/${id}`, { withCredentials: true });
        if (response.data.success) {
          alert('Campaign deleted');
          navigate('/my-campaigns'); // Redirect to the campaign list
        } else {
          alert('Failed to delete campaign');
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('Error deleting campaign');
      }
    };
  
    const goBack = () => {
      navigate('/my-campaigns'); // Navigate back to campaign list
    };
  
    if (loading) {
      return (
        <div className="loader-container">
          <Loader />
        </div>
      );
    }
  
    if (error) {
      return <div className="error">{error}</div>;
    }
  
    return (
        <div className="my-campaigns-container">
      <div className="single-campaign-container">
        <h1>{campaign.name}</h1>
        {campaign.image_url && (
          <img src={campaign.image_url} alt={campaign.name} className="campaign-image" />
        )}
        <p className={`campaign-status ${campaign.approved ? 'approved' : 'pending'}`}>
                  Status: {campaign.approved ? 'Approved' : 'Pending'}
                </p>
        <p>Goal: €{campaign.goal}</p>
        <p>Collected: €{campaign.collected}</p>
        <p>Description: {campaign.description}</p>
  
        <button onClick={deleteCampaign} className="delete-button">Delete Campaign</button><button onClick={goBack} className="back-button">← Back to Campaigns</button>
  
        <h2>Donations</h2>
        {donations.length === 0 ? (
          <p>No donations yet.</p>
        ) : (
          <table className="donations-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.id}>
                  <td>{donation.username}</td>
                  <td>{donation.email}</td>
                  <td>€{donation.amount}</td>
                  <td>{new Date(donation.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </div>
    );
}