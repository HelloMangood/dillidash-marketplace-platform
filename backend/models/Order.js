import mongoose from 'mongoose';

// Define the schema for individual items within an order
const orderItemSchema = new mongoose.Schema({
    productId: { // Using String for simplicity in MVP, not ObjectId reference
        type: String,
        required: [true, 'Product ID is required for order item'],
    },
    name: {
        type: String,
        required: [true, 'Product name is required for order item'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Product price is required for order item'],
        min: [0, 'Price cannot be negative'],
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required for order item'],
        min: [1, 'Quantity must be at least 1'],
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value for quantity',
        },
    },
}, { _id: false }); // Prevent Mongoose from creating an _id for subdocuments

// Custom validator to ensure the items array is not empty
const arrayLimit = (val) => {
    return val.length > 0;
};

// Define the main schema for the Order
const orderSchema = new mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store', // Reference to the Store model (ensure Store model is registered)
        required: [true, 'Store ID is required for the order'],
        index: true, // Index for efficient querying by store
    },
    customerDetails: {
        name: {
            type: String,
            required: [true, 'Customer name is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Customer phone number is required'],
            trim: true,
            // Basic phone number format validation could be added here if needed
        },
        address: {
            type: String,
            required: [true, 'Customer delivery address is required'],
            trim: true,
        },
    },
    items: {
        type: [orderItemSchema],
        required: true, // Ensure items array exists
        validate: [arrayLimit, 'Order must contain at least one item'], // Ensure items array is not empty
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['placed', 'accepted', 'out_for_delivery', 'delivered', 'cancelled'],
            message: '{VALUE} is not a supported order status.',
        },
        default: 'placed', // Default status when an order is created
        index: true, // Index for efficient querying by status
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount calculation is required'],
        min: [0, 'Total amount cannot be negative'],
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Pre-save middleware to calculate the totalAmount before saving the document
orderSchema.pre('save', function(next) {
    // Calculate total amount based on items array
    // `this` refers to the document being saved
    try {
        this.totalAmount = this.items.reduce((acc, item) => {
            // Ensure price and quantity are valid numbers before calculation
            const price = typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0;
            const quantity = typeof item.quantity === 'number' && Number.isInteger(item.quantity) ? item.quantity : 0;
            // Add item subtotal to accumulator
            return acc + (price * quantity);
        }, 0); // Initialize accumulator to 0
        next(); // Proceed with the save operation
    } catch (error) {
        // Pass potential calculation errors to the next middleware (error handler)
        next(error);
    }
});

// Compile the schema into a Mongoose model
// Mongoose will create a collection named 'orders' (pluralized, lowercase)
const Order = mongoose.model('Order', orderSchema);

// Export the Order model using ES Module syntax
export default Order;