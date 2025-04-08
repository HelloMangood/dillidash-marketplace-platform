import mongoose from 'mongoose';

// Define the schema for embedded products within a store
// These products represent the items a store offers.
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    category: {
        type: String,
        trim: true,
        // Consider adding an enum later if categories become standardized
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Product price cannot be negative'],
    },
    // Note: Inventory tracking is excluded for MVP simplicity
}, {
    // Prevent Mongoose from creating an _id for embedded product documents
    // This simplifies product management within the store document for MVP
    _id: false
});

// Define the main schema for the Store
const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Store name is required'],
        trim: true,
    },
    address: {
        // Embedded object for address details
        street: {
            type: String,
            trim: true,
            // Optional: Add max length validation if needed
        },
        city: {
            type: String,
            required: [true, 'City is required for store address'],
            trim: true,
        },
        pincode: {
            type: String,
            required: [true, 'Pincode is required for store address'],
            trim: true,
            // Validate Indian 6-digit pincode format (starts 1-9, followed by 5 digits)
            match: [/^[1-9][0-9]{5}$/, 'Please provide a valid 6-digit Indian pincode'],
            // CRITICAL: Index for efficient location-based (pincode) store lookups
            index: true,
        },
        // Consider adding state/country later if expanding scope
    },
    contactPhone: {
        type: String,
        trim: true,
        // Validate 10-digit Indian mobile number format (starting with 6, 7, 8, or 9)
        match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number'],
        // Consider making this unique later if required for login/identification
    },
    categories: {
        // Array of strings representing store categories (e.g., 'Grocery', 'Pharmacy')
        type: [String],
        // Mongoose applies trim to string array elements by default
    },
    products: {
        // Array of embedded product documents using the defined productSchema
        type: [productSchema],
        // Optional: Add validation for maximum number of products per store if needed
    },
    isActive: {
        // Flag to indicate if the store is currently active and visible on the platform
        type: Boolean,
        default: true,
        // Index for efficiently filtering active/inactive stores
        index: true,
    },
    // Potential future fields: ownerId (ref: User), openingHours, deliveryRadius, ratings, images
}, {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
});

// Compile the storeSchema into a Mongoose model named 'Store'
// Mongoose will automatically create a MongoDB collection named 'stores' (lowercase, plural)
const Store = mongoose.model('Store', storeSchema);

// Export the Store model using ES Module syntax
export default Store;