import express from 'express';
import sessionMiddleware from './middleware/sessionMiddleware.js';
import authRoutes from './route/authRoutes.js'; 
import campaignRoutes from './route/campaignRoutes.js';
import donationRoutes from './route/donationRoutes.js';

const app = express();

// Middlewares
sessionMiddleware(app);
app.use(express.json());

// Routes
app.use('/', authRoutes);
app.use('/', campaignRoutes); //all campaign routes will start with /campaigns
app.use('/donations', donationRoutes); //all donation routes will start with /donations
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});