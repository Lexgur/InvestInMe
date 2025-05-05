import Hero from './Hero';
import './HomePage.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as C from './constants';

export default function HomePage() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    axios.get(`${C.URL}campaigns/`).then(res => {
      if (res.data.success) {
        setCampaigns(res.data.campaigns);
      }
    });
  }, []);

  const topThree = campaigns.slice(0, 3);

  return (
    <>
      <Hero />
      <div className='home-content'>
        <h3 className='home-content-title'>
          Discover investments inspired by what people really wanted
        </h3>

        <div className="home-campaign-section">
          {topThree.length === 3 && (
            <>
              <div className="large-card">{renderCard(topThree[0])}</div>
              <div className="small-cards">
                {renderCard(topThree[1])}
                {renderCard(topThree[2])}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function renderCard(campaign) {
  return (
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
    </div>
  );
}
