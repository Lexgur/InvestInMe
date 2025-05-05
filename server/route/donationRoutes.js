import express from 'express';
import { createDonation, getDonationsByCampaignId, getDonationsWithUserInfo, getTotalDonatedAmount, getTopInvestors } from '../model/donationModel.js';

const router = express.Router();

// Create a new donation
router.post('/donate', async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { campaignId, amount } = req.body;

  if (!campaignId || !amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Campaign ID and a positive donation amount are required' });
  }

  try {
    const donationId = await createDonation({
      userId: user.id,
      campaignId,
      amount
    });

    res.status(201).json({
      success: true,
      message: 'Donation successful',
      donationId
    });
  } catch (err) {
    console.error('Error creating donation:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/campaign/:campaignId', async (req, res) => {
  const { campaignId } = req.params;

  try {
    const donations = await getDonationsWithUserInfo(campaignId);
    res.status(200).json({ success: true, donations });
  } catch (err) {
    console.error('Error fetching donations:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const donations = await getDonationsByUserId(userId);
    res.status(200).json({ success: true, donations });
  } catch (err) {
    console.error('Error fetching user\'s donations:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//get top investors 

router.get('/top-investors', async (req, res) => {
  try {
    const userId = req.query.userId; // Get userId from the request query
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const investors = await getTopInvestors(userId); // Pass userId to the function
    res.status(200).json({ success: true, topInvestors: investors });
  } catch (err) {
    console.error('Error fetching top investors:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/total', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId query param required' });
  }

  try {
    const total = await getTotalDonatedAmount(userId);
    res.status(200).json({ success: true, totalDonated: total });
  } catch (err) {
    console.error('Error fetching total donations:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


export default router;
