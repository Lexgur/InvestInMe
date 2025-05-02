import express from 'express';
import { createDonation, getDonationsByCampaignId, getDonationsWithUserInfo } from '../model/donationModel.js';

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

export default router;
