// src/controllers/auth.controller.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validasi input dasar
    if (!email || !password) {
      return errorResponse(res, 'Validation Error', {
        email: !email ? 'Email wajib diisi' : undefined,
        password: !password ? 'Password wajib diisi' : undefined,
      }, 400);
    }

    // Cari user berdasarkan email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      // Sengaja pesan errornya digeneralisir (bukan "email tidak ditemukan"),
      // ini praktik keamanan supaya orang jahat nggak bisa menebak-nebak email mana yang valid
      return errorResponse(res, 'Email atau password salah', {}, 401);
    }

    const user = result.rows[0];

    // Bandingkan password yang diinput dengan hash yang tersimpan
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return errorResponse(res, 'Email atau password salah', {}, 401);
    }

    // Buat token JWT, isinya info penting user (jangan simpan password di sini!)
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return successResponse(res, 'Login berhasil', {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Terjadi kesalahan server', { detail: err.message }, 500);
  }
}

async function logout(req, res) {
  // Catatan: karena JWT bersifat stateless (server tidak menyimpan sesi),
  // proses "logout" yang sesungguhnya cukup dilakukan di sisi frontend
  // dengan cara menghapus token yang tersimpan (misal dari localStorage).
  // Endpoint ini disediakan supaya frontend punya endpoint resmi untuk dipanggil.
  return successResponse(res, 'Logout berhasil', {});
}

module.exports = { login, logout };