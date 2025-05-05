import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as C from '../constants';
import Loader from '../Loader';
import './SingleCampaignPage.css';

export default function PublicCampaignPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const response = await axios.get(`${C.URL}campaigns/${id}`);
                if (response.data.success) {
                    setCampaign(response.data.campaign);
                } else {
                    setError('Campaign not found');
                }
            } catch (err) {
                console.error(err);
                setError('Error loading campaign');
            } finally {
                setLoading(false);
            }
        };

        fetchCampaign();
    }, [id]);

    const goBack = () => {
        navigate('/campaigns'); // Navigate back to campaign list
    };

    if (loading) return <div className="loader-container"><Loader /></div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="my-campaigns-container">
            <div className="single-campaign-container">
                <h1>{campaign.name}</h1>
                {campaign.image_url && (
                    <img src={campaign.image_url} alt={campaign.name} className="campaign-image" />
                )}
                <div className="progress-section">
                    <div className="progress-text">
                        €{campaign.collected.toLocaleString()} raised of €
                        {campaign.goal.toLocaleString()}
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${Math.min((campaign.collected / campaign.goal) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>

                {campaign.collected < campaign.goal && (
                    <button
                        className="donate-button"
                        onClick={() => navigate(`/donations/donate/${id}`)}
                    >
                        Donate Now
                    </button>
                )}<button onClick={goBack} className="back-button">← Back to Campaigns</button>
            </div>
        </div>
    );
}
