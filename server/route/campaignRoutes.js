import express from 'express';
import { createCampaign, getAllCampaigns, getCampaignById, getCampaignsByUserId } from '../model/campaignModel.js';
import pool from '../middleware/databaseConnection.js';

const router = express.Router();

// CREATE NEW CAMPAIGN
router.post('/campaigns/new', async (req, res) => {
  console.log('Request for new campaign received');
  const user = req.session.user;
  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { name, goal, imageUrl } = req.body;

  if (!name || !goal) {
    return res.status(400).json({ success: false, message: 'Name and goal are required' });
  }

  if (isNaN(goal) || goal <= 0) {
    return res.status(400).json({ success: false, message: 'Goal must be a positive number' });
  }

  try {
    const campaignId = await createCampaign({
      userId: user.id,
      name,
      goal,
      imageUrl
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
router.get('/campaigns/', async (req, res) => {
  try {
    const campaigns = await getAllCampaigns(true);
    res.status(200).json({ success: true, campaigns });
  } catch (err) {
    console.error('Error fetching campaigns:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// View one campaign (Public)
router.get('/campaigns/:id', async (req, res) => {
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

router.get('/my-campaigns', async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const campaigns = await getCampaignsByUserId(user.id);
    res.status(200).json({ success: true, campaigns });
  } catch (err) {
    console.error('Error fetching user campaigns:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
  
router.get('/admin', async (req, res) => {
  const user = req.session.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  try {
    const campaigns = await getAllCampaigns(false);
    const pending = campaigns.filter(c => !c.approved);
    res.status(200).json({ success: true, campaigns: pending });
  } catch (err) {
    console.error('Error fetching pending campaigns:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/approve/:id', async (req, res) => {
  const user = req.session.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const { id } = req.params;
  try {
    await pool.execute('UPDATE campaigns SET approved = 1 WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Campaign approved' });
  } catch (err) {
    console.error('Error approving campaign:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// DELETE CAMPAIGN
router.delete('/campaigns/:id', async (req, res) => {
  const user = req.session.user;
  const { id } = req.params;

  try {
    const campaign = await getCampaignById(id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    if (campaign.user_id !== user.id) {
      return res.status(403).json({ success: false, message: 'Not allowed to delete this campaign' });
    }

    await pool.execute('DELETE FROM campaigns WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Campaign deleted' });
  } catch (err) {
    console.error('Error deleting campaign:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//ADMIN DELETE CAMPAIGN

router.delete('/admin/delete/:id', async (req, res) => {
  const user = req.session.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const { id } = req.params;

  try {
    const [result] = await pool.execute('DELETE FROM campaigns WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    res.status(200).json({ success: true, message: 'Campaign deleted by admin' });
  } catch (err) {
    console.error('Error deleting campaign as admin:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
