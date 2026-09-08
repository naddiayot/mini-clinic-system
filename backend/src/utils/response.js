
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