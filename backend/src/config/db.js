// src/config/db.js
// File ini bertugas membuat koneksi (pool) ke database PostgreSQL
// yang akan dipakai di seluruh bagian aplikasi.

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Cek koneksi saat aplikasi pertama kali jalan
pool.connect()
  .then((client) => {
    console.log('✅ Berhasil terhubung ke database PostgreSQL');
    client.release();
  })
  .catch((err) => {
    console.error('❌ Gagal terhubung ke database:', err.message);
  });

module.exports = pool;