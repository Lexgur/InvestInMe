import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

(async () => {
  try {
    const pool = await mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: 'root123',
      database: 'invest',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log("Mes prijungem prie DB");

    const port = 3000;
    app.listen(port, () => {
      console.log(`Serveris klauso ${port} porto.`);
    });


  } catch (err) {
    console.error('Database connection failed:', err);
  }
})();
