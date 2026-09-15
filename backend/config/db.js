const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false // Bắt buộc khi kết nối Supabase từ bên ngoài
        }
      }
    : {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'PhongHCM',
        password: process.env.DB_PASSWORD || '171104',
        port: process.env.DB_PORT || 5432,
      }
);

pool.on('connect', () => {
  console.log('Connect database PostgreSQL thành công!');
});

module.exports = pool;