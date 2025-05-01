import mysql from 'mysql2/promise';
import pkg from '../../config/config.js';

const { db } = pkg;

const pool = mysql.createPool(db);

export default pool;