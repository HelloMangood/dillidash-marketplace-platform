// frontend/src/services/apiService.js
import axios from 'axios';

// --- Axios Instance Configuration ---

// Fetch the base URL from environment variables provided by Vite
// Ensure VITE_API_BASE_URL is defined in your .env file (e.g., VITE_API_BASE_URL=http://localhost:3001)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error(
    'Critical: VITE_API_BASE_URL is not defined in environment variables. API calls will fail.'
  );
  // Optionally throw an error or handle this case more gracefully depending on requirements
  // throw new Error('VITE_API_BASE_URL is not defined.');
}

const apiClient = axios.create({
  baseURL: API_BASE_URL || '/api', // Fallback to relative /api if env var is missing, though less ideal
  timeout: 10000, // 10 seconds request timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// --- JSDoc Type Definitions (for clarity) ---

/**
 * Represents the structure of a Store object fetched from the backend.
 * Based on backend/models/Store.js
 * @typedef {object} Store
 * @property {string} _id - Unique identifier (MongoDB ObjectId as string).
 * @property {string} name
 * @property {{ street?: string, city: string, pincode: string }} address
 * @property {string} [contactPhone]
 * @property {string[]} [categories]
 * @property {Product[]} [products] - Embedded product list (may not be present in all endpoints).
 * @property {boolean} isActive
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * Represents the structure of an embedded Product object within a Store.
 * Based on backend/models/Store.js productSchema
 * @typedef {object} Product
 * @property {string} name
 * @property {string} [category]
 * @property {number} price
 */

/**
 * Represents the structure of an Order object fetched from the backend.
 * Based on backend/models/Order.js
 * @typedef {object} Order
 * @property {string} _id - Unique identifier (MongoDB ObjectId as string).
 * @property {string} storeId - Reference to the Store (_id).
 * @property {{ name: string, phone: string, address: string }} customerDetails
 * @property {OrderItem[]} items
 * @property {string} status - e.g., 'placed', 'accepted', etc.
 * @property {number} totalAmount
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * Represents the structure of an embedded OrderItem object within an Order.
 * Based on backend/models/Order.js orderItemSchema
 * @typedef {object} OrderItem
 * @property {string} productId - Identifier from the cart/product (string for MVP).
 * @property {string} name
 * @property {number} price
 * @property {number} quantity
 */

/**
 * Represents the structure of a CartItem payload used in createOrder.
 * Based on frontend/src/context/CartContext.jsx
 * @typedef {object} CartItemPayload
 * @property {string} productId
 * @property {string} name
 * @property {number} price
 * @property {number} quantity
 */

/**
 * Represents the structure of the payload for creating a new order.
 * @typedef {object} OrderPayload
 * @property {string} storeId - The ID of the store (_id).
 * @property {object} customerDetails
 * @property {string} customerDetails.name
 * @property {string} customerDetails.phone
 * @property {string} customerDetails.address
 * @property {CartItemPayload[]} items - Array of items from the cart.
 */


// --- Helper for Logging Errors ---
const logError = (context, error) => {
  // Only log detailed errors in development
  if (import.meta.env.MODE !== 'production') { // Vite uses MODE for environment
    console.error(`[apiService] Error in ${context}:`, error);
    if (error.response) {
      // Request made and server responded with a status code outside 2xx
      console.error('[apiService] Response Status:', error.response.status);
      console.error('[apiService] Response Data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('[apiService] No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('[apiService] Request setup error:', error.message);
    }
  }
  // Consider integrating a proper logging service for production errors later
};

// --- API Service Functions ---

/**
 * Fetches a list of stores matching the provided pincode.
 * @async
 * @param {string} pincode - The 6-digit Indian pincode to search for.
 * @returns {Promise<Store[]>} A promise that resolves to an array of Store objects.
 * @throws {Error} Throws an error if the pincode is invalid or the API call fails.
 */
const fetchStoresByPincode = async (pincode) => {
  // Basic input validation
  if (!pincode || typeof pincode !== 'string' || !/^[1-9][0-9]{5}$/.test(pincode)) {
     const error = new Error('Invalid pincode provided. Please enter a valid 6-digit Indian pincode.');
     logError('fetchStoresByPincode validation', error);
     // Throw immediately for invalid input, preventing API call
     throw error;
  }

  try {
    const response = await apiClient.get('/api/stores', {
      params: { pincode }, // Send pincode as a query parameter
    });
    // Axios handles non-2xx responses by throwing an error
    return response.data; // Expected format: Array of Store objects
  } catch (error) {
    logError('fetchStoresByPincode', error);
    // Re-throw the error so the calling component can handle UI state
    throw error;
  }
};

/**
 * Fetches detailed information for a single store by its ID.
 * @async
 * @param {string} storeId - The unique identifier of the store (MongoDB ObjectId as string).
 * @returns {Promise<Store>} A promise that resolves to a single Store object.
 * @throws {Error} Throws an error if the storeId is invalid or the API call fails (e.g., 404 Not Found).
 */
const fetchStoreDetails = async (storeId) => {
  if (!storeId || typeof storeId !== 'string' || storeId.trim().length === 0) {
     const error = new Error('Invalid store ID provided.');
     logError('fetchStoreDetails validation', error);
     throw error;
  }
  try {
    const response = await apiClient.get(`/api/stores/${storeId}`);
    return response.data; // Expected format: Single Store object
  } catch (error) {
    logError(`fetchStoreDetails (ID: ${storeId})`, error);
    throw error;
  }
};

/**
 * Fetches the list of products for a specific store.
 * Assumes a dedicated backend endpoint `/api/stores/:storeId/products` exists.
 * @async
 * @param {string} storeId - The unique identifier of the store (MongoDB ObjectId as string).
 * @returns {Promise<Product[]>} A promise that resolves to an array of Product objects.
 * @throws {Error} Throws an error if the storeId is invalid or the API call fails.
 */
const fetchStoreProducts = async (storeId) => {
   if (!storeId || typeof storeId !== 'string' || storeId.trim().length === 0) {
     const error = new Error('Invalid store ID provided.');
     logError('fetchStoreProducts validation', error);
     throw error;
  }
  try {
    // If the backend doesn't have this dedicated endpoint, this call will fail.
    // Alternatively, one could call fetchStoreDetails and extract products,
    // but that might fetch unnecessary data if only products are needed.
    const response = await apiClient.get(`/api/stores/${storeId}/products`);
    return response.data; // Expected format: Array of Product objects
  } catch (error) {
    logError(`fetchStoreProducts (ID: ${storeId})`, error);
    throw error;
  }
};

/**
 * Submits a new guest order to the backend.
 * @async
 * @param {OrderPayload} orderData - The order data payload conforming to the OrderPayload structure.
 * @returns {Promise<Order | object>} A promise that resolves to the created order details or a success response object from the backend.
 * @throws {Error} Throws an error if the orderData structure is invalid or the API call fails (e.g., 400 Bad Request due to backend validation).
 */
const createOrder = async (orderData) => {
  // Perform basic structural validation before sending
  if (
    !orderData || typeof orderData !== 'object' ||
    typeof orderData.storeId !== 'string' || !orderData.storeId ||
    typeof orderData.customerDetails !== 'object' || !orderData.customerDetails ||
    typeof orderData.customerDetails.name !== 'string' || !orderData.customerDetails.name ||
    typeof orderData.customerDetails.phone !== 'string' || !orderData.customerDetails.phone ||
    typeof orderData.customerDetails.address !== 'string' || !orderData.customerDetails.address ||
    !Array.isArray(orderData.items) || orderData.items.length === 0
    ) {
    const error = new Error('Invalid order data structure provided.');
    logError('createOrder validation', { error, orderData }); // Log the problematic data
    throw error;
  }
   // Optional: Add basic validation for item structure if needed, though backend should be primary validator
   const invalidItem = orderData.items.find(item =>
     typeof item.productId !== 'string' || !item.productId ||
     typeof item.name !== 'string' || !item.name ||
     typeof item.price !== 'number' || isNaN(item.price) || item.price < 0 ||
     typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity < 1
   );
   if (invalidItem) {
     const error = new Error('Invalid item structure found in order data.');
     logError('createOrder validation (items)', { error, invalidItem });
     throw error;
   }

  try {
    const response = await apiClient.post('/api/orders', orderData);
    return response.data; // Expected: Created Order object or { message: 'Success' }
  } catch (error) {
    logError('createOrder', error);
    // Try to extract a user-friendly message from backend's structured error (AppError)
    const backendMessage = error.response?.data?.message;
    if (backendMessage) {
        const structuredError = new Error(backendMessage);
        structuredError.statusCode = error.response?.status;
        structuredError.originalError = error; // Keep reference
        throw structuredError;
    }
    // Fallback to re-throwing the original Axios error
    throw error;
  }
};

/**
 * Fetches the list of orders placed for a specific store (intended for admin view).
 * Assumes a dedicated backend endpoint `/api/stores/:storeId/orders` exists and is secured appropriately.
 * @async
 * @param {string} storeId - The unique identifier of the store (MongoDB ObjectId as string).
 * @returns {Promise<Order[]>} A promise that resolves to an array of Order objects placed for that store.
 * @throws {Error} Throws an error if the storeId is invalid or the API call fails.
 */
const fetchStoreOrders = async (storeId) => {
  if (!storeId || typeof storeId !== 'string' || storeId.trim().length === 0) {
     const error = new Error('Invalid store ID provided.');
     logError('fetchStoreOrders validation', error);
     throw error;
  }
  try {
    // Ensure this backend endpoint exists and handles authorization if needed
    const response = await apiClient.get(`/api/stores/${storeId}/orders`);
    return response.data; // Expected format: Array of Order objects
  } catch (error) {
    logError(`fetchStoreOrders (ID: ${storeId})`, error);
    throw error;
  }
};

// --- Exports ---
// Export all implemented API functions using named exports
export {
  fetchStoresByPincode,
  fetchStoreDetails,
  fetchStoreProducts,
  createOrder,
  fetchStoreOrders,
};