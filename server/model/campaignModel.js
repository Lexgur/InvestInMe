import pool from '../middleware/databaseConnection.js';

export async function createCampaign({ userId, name, goal, imageUrl }) {
  const result = await pool.query(
    `INSERT INTO campaigns (user_id, name, goal, image_url, approved)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, name, goal, imageUrl, false]
  );
  return result.lastID;
}

export async function getAllCampaigns(onlyApproved = false) {
  let query = 'SELECT * FROM campaigns';
  let values = [];

  if (onlyApproved) {
    query += ' WHERE approved = 1';
  }

  const [rows] = await pool.execute(query, values);
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