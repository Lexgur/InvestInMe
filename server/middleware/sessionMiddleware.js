import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import mysqlSessionFactory from 'express-mysql-session';
import cors from 'cors';
import pool from './databaseConnection.js'; 

const MySQLStore = mysqlSessionFactory(session);

const sessionStore = new MySQLStore({
  createDatabaseTable: true, 
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
}, pool);

const sessionMiddleware = (app) => {
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(session({
    secret: uuidv4(), 
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
  }));
};

export default sessionMiddleware;