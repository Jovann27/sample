class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  console.error("🔥 Error:", err);
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (err.name === "CastError") err = new ErrorHandler(`Resource not found. Invalid ${err.path}`, 400);
  if (err.code === 11000) err = new ErrorHandler(`Duplicate field value entered: ${Object.keys(err.keyValue)}`, 400);
  if (err.name === "JsonWebTokenError") err = new ErrorHandler("Invalid JSON Web Token", 401);
  if (err.name === "TokenExpiredError") err = new ErrorHandler("JSON Web Token expired", 401);

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
