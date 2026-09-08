
const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

// Middleware ini mengecek apakah request punya token JWT yang valid.
// Dipasang di endpoint mana pun yang HARUS login dulu untuk diakses.
function verifyToken(req, res, next) {
  // Token dikirim frontend lewat header: Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Token tidak ditemukan, silakan login', {}, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // simpan info user (id, role, dst) supaya bisa dipakai di controller berikutnya
    next(); // token valid, lanjut ke proses berikutnya
  } catch (err) {
    return errorResponse(res, 'Token tidak valid atau sudah kedaluwarsa', {}, 401);
  }
}

// Middleware ini mengecek apakah role user termasuk yang diizinkan.
// Dipakai SETELAH verifyToken, contoh: authorize('admin', 'dokter')
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 'Anda tidak memiliki akses untuk aksi ini', {}, 403);
    }
    next();
  };
}

module.exports = { verifyToken, authorize };