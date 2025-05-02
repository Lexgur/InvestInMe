import pool from '../middleware/databaseConnection.js';

export async function createCampaign({ userId, name, goal, collected = 0.00, imageUrl = null }) {
    const [result] = await pool.query(
      'INSERT INTO campaigns (user_id, name, goal, collected, image_url) VALUES (?, ?, ?, ?, ?)',
      [userId, name, goal, collected, imageUrl]
    );
    return result.insertId; 
  }

  export async function getAllCampaigns() {
    const [rows] = await pool.query('SELECT * FROM campaigns');
    return rows;
  }

  export async function getCampaignsByUserId(userId) {
    const [rows] = await pool.query('SELECT * FROM campaigns WHERE user_id = ?', [userId]);
    return rows;
  }

export async function getCampaignById(campaignId) {
    const [rows] = await pool.query('SELECT * FROM campaigns WHERE id = ?', [campaignId]);
    return rows[0] || null; 
  }

export async function updateCollectedAmount(campaignId, amount) {
  const [result] = await pool.query(
    'UPDATE campaigns SET collected = collected + ? WHERE id = ?',
    [amount, campaignId]
  );
  return result.affectedRows > 0;
}