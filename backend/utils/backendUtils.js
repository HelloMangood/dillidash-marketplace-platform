<?xml version="1.0" encoding="UTF-8"?>
```javascript
// backend/utils/backendUtils.js
// Using ES Modules syntax as specified in backend/package.json ("type": "module")

/**
 * Custom Error class for operational errors (expected errors like user input errors,
 * resource not found, etc.) that can be safely sent to the client in production.
 * Extends the built-in Error class.
 */
class AppError extends Error {
  /**
   * Creates an instance of AppError.
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code (e.g., 400, 404, 500).
   */
  constructor(message, statusCode) {
    // Call the parent Error constructor with the message
    super(message);

    // Set the HTTP status code
    this.statusCode = statusCode;

    // Determine the status based on the statusCode ('fail' for 4xx, 'error' for 5xx)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // Mark this error as operational (trusted error, predictable)
    this.isOperational = true;

    // Capture the stack trace, excluding the constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Wraps an asynchronous Express route handler function to catch any errors
 * (rejected promises) and pass them to the Express global error handler via next().
 *
 * @param {Function} fn - The asynchronous route handler function (req, res, next) => Promise<void>.
 * @returns {Function} An Express middleware function (req, res, next).
 */
const catchAsync = (fn) => {
  // Return a new function that takes (req, res, next)
  return (req, res, next) => {
    // Execute the original async function (fn)
    // If the promise returned by fn rejects, catch the error and pass it to next()
    fn(req, res, next).catch(next); // Equivalent to .catch(err => next(err))
  };
};

// --- Production Error Handling Helpers ---

/**
 * Handles Mongoose CastError (e.g., invalid ObjectId format) by creating
 * a user-friendly operational error.
 * @param {Error} err - The original Mongoose CastError.
 * @returns {AppError} A new AppError instance for Bad Request (400).
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}. Please provide a valid ID format.`;
  return new AppError(message, 400); // 400 Bad Request
};

/**
 * Handles Mongoose ValidationError by consolidating validation messages
 * into a user-friendly operational error.
 * @param {Error} err - The original Mongoose ValidationError.
 * @returns {AppError} A new AppError instance for Bad Request (400).
 */
const handleValidationErrorDB = (err) => {
  // Extract individual validation error messages from the Mongoose error object
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400); // 400 Bad Request
};

// --- Development/Production Response Sending Functions ---

/**
 * Sends a detailed error response during development.
 * Includes status, error object, message, and stack trace.
 * @param {Error} err - The error object.
 * @param {import('express').Response} res - The Express response object.
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    error: err, // Include the full error object for debugging
    message: err.message,
    stack: err.stack, // Include the stack trace
  });
};

/**
 * Sends a concise, user-friendly error response during production.
 * Only sends details for operational errors; otherwise, sends a generic message.
 * @param {Error | AppError} err - The error object (potentially an AppError).
 * @param {import('express').Response} res - The Express response object.
 */
const sendErrorProd = (err, res) => {
  // A) Operational, trusted error (created with AppError): send specific message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // B) Programming or other unknown error: don't leak error details
  // 1. Logging is handled in the main globalErrorHandler function

  // 2. Send generic message to the client
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong! Please try again later.', // Generic message
  });
};


/**
 * Global Express error handling middleware. Catches errors passed via next(err),
 * logs them, and sends an appropriate JSON response based on the environment
 * (NODE_ENV) and error type.
 *
 * @param {Error | AppError} err - The error object passed from previous middleware or route handlers.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function (unused here but required by signature).
 */
const globalErrorHandler = (err, req, res, next) => {
  // Log the error details for server-side debugging, regardless of environment
  // Using console.error is standard for errors
  console.error(`ERROR processing ${req?.method} ${req?.originalUrl || 'request'}:`, err);
  // Include stack trace in logs even in production for easier debugging
  // console.error(err.stack); // Uncomment if verbose stack traces are desired in logs

  // Ensure default status code and status if they are missing from the error object
  err.statusCode = err.statusCode || 500; // Default to 500 Internal Server Error
  err.status = err.status || 'error';

  // Determine the environment, defaulting to 'development' if not explicitly set
  const nodeEnv = process.env.NODE_ENV || 'development';

  // --- Development Environment Error Response ---
  if (nodeEnv === 'development') {
    sendErrorDev(err, res);
  }
  // --- Production Environment Error Response ---
  else if (nodeEnv === 'production') {
    // Make a copy or reference the original error. Creating new AppError instances for specific cases is safer.
    let error = err;

    // Handle specific technical errors by converting them into operational AppErrors
    // so sendErrorProd can handle them gracefully.
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    // Potential future handlers:
    // if (error.code === 11000) error = handleDuplicateFieldsDB(error); // MongoDB duplicate key
    // if (error.name === 'JsonWebTokenError') error = handleJWTError();
    // if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    // Send the processed error response for production
    sendErrorProd(error, res);
  }
  // --- Fallback for unexpected NODE_ENV values ---
  else {
    console.error('Unknown NODE_ENV specified:', nodeEnv, '- Sending generic production error response.');
    // Treat unknown environments like production for safety - don't leak details
    let error = err;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    sendErrorProd(error, res);
  }
};

// Export the utilities for use in other backend modules
export { AppError, catchAsync, globalErrorHandler };