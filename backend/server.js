import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import route handlers (assuming they exist and export Express Routers)
import storeRoutes from './routes/stores.js';
import orderRoutes from './routes/orders.js';

// Import placeholder error handler (assuming it exists and exports the middleware)
import errorHandler from './utils/errorHandler.js';

// --- Environment Configuration ---
// Load environment variables from the root .env file
// Ensure this path is correct relative to where the server process is started
dotenv.config({ path: '../.env' });

// --- Database Connection ---
const connectDB = async () => {
  try {
    // Use the MONGODB_URI from the loaded environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure code if database connection fails
    process.exit(1);
  }
};

// Initiate Database Connection
connectDB();

// --- Express Application Initialization ---
const app = express();

// --- Middleware Configuration ---
// Apply CORS middleware - allows all origins by default for MVP
app.use(cors());

// Apply middleware to parse JSON request bodies
// limit option can be adjusted based on expected payload size
app.use(express.json({ limit: '10mb' }));

// --- Basic Health Check Endpoint ---
app.get('/', (req, res) => {
  res.status(200).send('Quick Commerce Backend API is running');
});

// --- API Route Mounting ---
// Mount store routes under /api/stores
app.use('/api/stores', storeRoutes);

// Mount order routes under /api/orders
app.use('/api/orders', orderRoutes);

// --- Global Error Handler ---
// This must be mounted *after* all the API routes
app.use(errorHandler);

// --- Server Startup ---
// Define the port, using environment variable or fallback to 3001
const PORT = process.env.PORT || 3001;

// Start the server and listen on the defined port
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`, { stack: err.stack });
  // Close server & exit process
  // Allow existing requests to finish before shutting down gracefully
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
    // Close server & exit process immediately for uncaught exceptions
    server.close(() => process.exit(1));
});