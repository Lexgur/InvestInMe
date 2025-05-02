import express from 'express';
import sessionMiddleware from './middleware/sessionMiddleware.js';
import authRoutes from './route/authRoutes.js'; 
import campaignRoutes from './route/campaignRoutes.js';

const app = express();

// Middlewares
sessionMiddleware(app);
app.use(express.json()); // for parsing application/json

// Routes
app.use('/register', authRoutes);
app.use('/login', authRoutes);
app.use('/logout', authRoutes);
app.use('/campaigns', campaignRoutes); // All campaign routes will now be under /campaigns

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});