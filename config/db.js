const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'SIH_BE',
  password: 'pg1912',
  port: 5432,
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

module.exports = pool;
