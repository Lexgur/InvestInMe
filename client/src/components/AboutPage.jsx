import React from 'react';
import './AboutPage.css';

export default function AboutPage() {
    return (
        <div className="about-page-container">
            <h1>About This Project</h1>
            <p>
                Welcome to our crowdfunding platform! This project is designed to help users create and manage campaigns, collect donations, and raise funds for causes they care about.
            </p>
            <h2>Features</h2>
            <ul>
                <li>Users can create and view campaigns.</li>
                <li>Campaigns have a goal and a progress tracker showing how much has been raised.</li>
                <li>Donations can be made to campaigns to help reach their funding goals.</li>
                <li>Users can view campaign details and contribute to causes they believe in.</li>
            </ul>
            <h2>Tools Used</h2>
            <ul>
                <li><strong>React</strong>: A JavaScript library for building user interfaces.</li>
                <li><strong>React Router</strong>: Used for managing navigation between different pages.</li>
                <li><strong>Axios</strong>: A promise-based HTTP client for making requests to our backend API.</li>
                <li><strong>Node.js</strong>: The runtime environment for running JavaScript on the server side.</li>
                <li><strong>Express.js</strong>: A web application framework for Node.js, used for building the server-side API.</li>
                <li><strong>MySQL</strong>: The database used to store user, campaign, and donation data.</li>
                <li><strong>CSS/SCSS</strong>: Used for styling the frontend and ensuring a responsive design.</li>
            </ul>
            <h2>How It Works</h2>
            <p>
                Users can browse existing campaigns, view their progress, and donate directly through the platform. A campaign can be created by any logged-in user, and it requires a name, goal amount, and an optional image. Only the admin can approve a campaign.
                Each campaign has a unique URL, and users can follow their progress towards the fundraising goal. Donations can be made by logged-in users, and once a donation is made, the campaign's progress is updated in real time.
            </p>
        </div>
    );
}
