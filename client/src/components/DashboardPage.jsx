import React, { useEffect, useState } from 'react';
import '../style/dashboard.css';
import { useAuth } from './Auth/useAuth';
import axios from 'axios';
import * as C from './constants'; // Assuming constants like URL are in the constants file
import Loader from './Loader';

export default function DashboardPage() {
  const { user } = useAuth();
  const [totalDonated, setTotalDonated] = useState(0);
  const [userGoals, setUserGoals] = useState([]);
  const [topInvestors, setTopInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total donations made by the user
        const donationsResponse = await axios.get(`${C.URL}donations/total`, { params: { userId: user.id }, withCredentials: true });
        setTotalDonated(donationsResponse.data.totalDonated);

        // Fetch my campaigns and total donations to them
        const campaignsResponse = await axios.get(`${C.URL}my-campaigns`, { params: { userId: user.id }, withCredentials: true });
        setUserGoals(campaignsResponse.data.campaigns);

        // Fetch top investors for the user's campaigns
        const topInvestorsResponse = await axios.get(`${C.URL}donations/top-investors`, { params: { userId: user.id }, withCredentials: true });
        setTopInvestors(topInvestorsResponse.data.topInvestors);
      } catch (err) {
        console.error(err);
        setError('Error loading dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.id]);

  if (loading) return <div><Loader /></div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        <div>Welcome, {user.username}</div>
      </h1>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>How much I have donated?</h2>
          <p className="dashboard-value">€{totalDonated.toLocaleString()}</p>
        </div>

        <div className="dashboard-card">
          <h2>How much others have donated to my campaigns?</h2>
          <p className="dashboard-value">
            €{userGoals.reduce((total, goal) => total + parseFloat(goal.collected || 0), 0).toLocaleString()}
          </p>
        </div>

        <div className="dashboard-card full-width">
          <h2>Top Investors</h2>
          <ul className="top-investors-list">
            {topInvestors.map((investor, index) => (
              <li key={index}>
                {investor.username} – €{(parseFloat(investor.total_donated) || 0).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
