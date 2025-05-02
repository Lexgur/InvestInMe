import express from 'express';
import { createCampaign, getAllCampaigns, getCampaignById, getCampaignsByUserId } from '../model/campaignModel.js';

const router = express.Router();

// Create new campaign
router.post('/new', async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { name, goal, imageUrl } = req.body; // description removed

  if (!name || !goal) {
    return res.status(400).json({ success: false, message: 'Name and goal are required' });
  }

  // Ensure goal is a valid decimal (optional validation step)
  if (isNaN(goal) || goal <= 0) {
    return res.status(400).json({ success: false, message: 'Goal must be a positive number' });
  }

  try {
    const campaignId = await createCampaign({
      userId: user.id,
      name,
      goal,
      imageUrl // Optional field
    });

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      campaignId
    });
  } catch (err) {
    console.error('Error creating campaign:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// View all campaigns (Public)
router.get('/', async (req, res) => {
  try {
    const campaigns = await getAllCampaigns();
    res.status(200).json({ success: true, campaigns });
  } catch (err) {
    console.error('Error fetching campaigns:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// View one campaign (Public)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const campaign = await getCampaignById(id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    res.status(200).json({ success: true, campaign });
  } catch (err) {
    console.error('Error fetching campaign:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// View campaigns created by the logged-in user
router.get('/my-campaigns', async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const campaigns = await getCampaignsByUserId(user.id);
    res.status(200).json({ success: true, campaigns });
  } catch (err) {
    console.error('Error fetching user\'s campaigns:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
