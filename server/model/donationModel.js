import pool from '../middleware/databaseConnection.js';

export async function createDonation({ userId, campaignId, amount }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      'INSERT INTO donations (user_id, campaign_id, amount) VALUES (?, ?, ?)',
      [userId, campaignId, amount]
    );

    await connection.query(
      'UPDATE campaigns SET collected = collected + ? WHERE id = ?',
      [amount, campaignId]
    );

    await connection.commit();

    return result.insertId;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

export async function getDonationsWithUserInfo(campaignId) {
  const [rows] = await pool.query(`
    SELECT donations.id, donations.amount, donations.created_at, 
           users.username, users.email
    FROM donations
    JOIN users ON donations.user_id = users.id
    WHERE donations.campaign_id = ?
  `, [campaignId]);

  return rows;
}

export async function getDonationsByCampaignId(campaignId) {
  const [rows] = await pool.query(
    'SELECT id, user_id, campaign_id, amount, created_at FROM donations WHERE campaign_id = ?',
    [campaignId]
  );
  return rows;
}

export async function getDonationsByUserId(userId) {
  const [rows] = await pool.query(
    'SELECT id, user_id, campaign_id, amount, created_at FROM donations WHERE user_id = ?',
    [userId]
  );
  return rows;
}
