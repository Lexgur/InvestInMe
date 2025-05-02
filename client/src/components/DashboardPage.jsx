import React from 'react';
import '../style/dashboard.css';
import { useAuth } from './Auth/useAuth';

export default function DashboardPage() {

  const { user } = useAuth();
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title"><div>Welcome, {user.username}</div></h1>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>How much I invested?</h2>
          <p className="dashboard-value">€1,250</p>
        </div>

        <div className="dashboard-card">
          <h2>How much others invested in me?</h2>
          <p className="dashboard-value">€3,980</p>
        </div>

        <div className="dashboard-card full-width">
          <h2>Top Investors</h2>
          <ul className="top-investors-list">
            <li>John Doe – €1,200</li>
            <li>Jane Smith – €1,000</li>
            <li>Alex Developer – €780</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
