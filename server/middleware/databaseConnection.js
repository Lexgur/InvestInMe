import { createPool } from 'mysql2/promise';
import config from '../../config/config.js';

export const getPool = (dbConfig = config.db) => {
  return createPool(dbConfig);
};

const pool = getPool(); // for production usage
export default pool;