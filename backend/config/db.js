const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') }); // Ép trỏ chuẩn xác về file .env ở thư mục gốc

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'PhongHCM', // Khớp chính xác với tên database của đồng chí
    password: process.env.DB_PASSWORD || '171104',
    port: process.env.DB_PORT || 5432,
});

pool.on('connect', () => {
    console.log('Connect database PostgreSQL thành công!');
});

module.exports = pool;