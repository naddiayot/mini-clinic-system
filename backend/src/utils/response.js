// src/utils/response.js
// Helper ini dipakai supaya SEMUA endpoint mengembalikan format
// response yang konsisten, sesuai yang diminta di soal:
//
// Success -> { success: true, message: "...", data: {} }
// Error   -> { success: false, message: "...", errors: {} }

function successResponse(res, message = 'Success', data = {}, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function errorResponse(res, message = 'Error', errors = {}, statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

module.exports = { successResponse, errorResponse };