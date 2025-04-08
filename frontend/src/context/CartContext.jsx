<?xml version="1.0" encoding="UTF-8"?>
<code language="javascript">
// frontend/src/context/CartContext.jsx
import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

// --- Types (Conceptual for JSDoc) ---

/**
 * Represents a single item within the shopping cart.
 * @typedef {object} CartItem
 * @property {string} productId - Unique identifier for the product (ensure this matches the identifier used elsewhere, likely `_id` from MongoDB).
 * @property {string} name - Name of the product.
 * @property {number} price - Price of a single unit of the product.
 * @property {number} quantity - How many units of this product are in the cart.
 */

/**
 * Represents the overall state of the shopping cart.
 * @typedef {object} CartState
 * @property {string | null} storeId - The ID of the store items are currently being added from. Null if the cart is empty.
 * @property {CartItem[]} items - An array of items currently in the cart.
 */

// --- Initial State ---

/**
 * The initial state of the cart context.
 * @type {CartState}
 */
const initialCartState = {
  storeId: null,
  items: [],
};

// --- Reducer Function ---

/**
 * Pure function to handle cart state transitions based on dispatched actions.
 * Enforces the single-store rule for adding items.
 * @param {CartState} state - The current state of the cart.
 * @param {object} action - The action object dispatched to modify the state.
 * @param {string} action.type - The type of action to perform.
 * @param {object} [action.payload] - The payload associated with the action.
 * @returns {CartState} The new state of the cart.
 * @throws {Error} If an unhandled action type is received.
 *
 * @example Action Payloads:
 * // ADD_ITEM: { item: { productId: string, name: string, price: number }, storeId: string }
 * // REMOVE_ITEM: { productId: string }
 * // UPDATE_QUANTITY: { productId: string, quantity: number }
 * // CLEAR_CART: (no payload)
 *
 * @tests Unit tests should cover:
 * - Adding the first item to an empty cart.
 * - Adding a new item from the same store.
 * - Adding an existing item (incrementing quantity) from the same store.
 * - Adding an item from a different store (clearing previous cart).
 * - Removing an item, leaving other items.
 * - Removing the last item (clearing cart and storeId).
 * - Updating quantity to a positive value.
 * - Updating quantity to 0 or less (removing the item).
 * - Updating quantity for a non-existent item (should not change state).
 * - Clearing a non-empty cart.
 * - Handling invalid action payloads gracefully (returning current state).
 * - Throwing error for unknown action types.
 */
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Validate payload
      const { item, storeId } = action.payload ?? {};
      if (!item || typeof item.productId !== 'string' || !item.productId || typeof item.name !== 'string' || !item.name || typeof item.price !== 'number' || isNaN(item.price) || item.price < 0 || typeof storeId !== 'string' || !storeId) {
        console.warn('[CartContext] Invalid ADD_ITEM payload:', action.payload);
        return state;
      }

      // Single-Store Logic Enforcement
      if (state.storeId !== null && state.storeId !== storeId) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[CartContext] Adding item from different store (${storeId}). Clearing cart from store ${state.storeId}.`);
        }
        // Replace the cart with the new item from the new store
        return {
          storeId: storeId,
          items: [{ ...item, quantity: 1 }],
        };
      }

      // Same store or initially empty cart
      const newStoreId = state.storeId ?? storeId;
      const existingItemIndex = state.items.findIndex(
        (cartItem) => cartItem.productId === item.productId
      );

      let newItemsArray;
      if (existingItemIndex >= 0) {
        // Item exists, increment quantity
        newItemsArray = state.items.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Item does not exist, add it with quantity 1
        newItemsArray = [...state.items, { ...item, quantity: 1 }];
      }

      return {
        storeId: newStoreId,
        items: newItemsArray,
      };
    }

    case 'REMOVE_ITEM': {
      // Validate payload
      const { productId } = action.payload ?? {};
      if (typeof productId !== 'string' || !productId) {
        console.warn('[CartContext] Invalid REMOVE_ITEM payload:', action.payload);
        return state;
      }

      const newItems = state.items.filter((item) => item.productId !== productId);

      // If removing the item makes the cart empty, reset storeId
      if (newItems.length === 0) {
        return initialCartState;
      } else {
        return { ...state, items: newItems };
      }
    }

    case 'UPDATE_QUANTITY': {
      // Validate payload
      const { productId, quantity } = action.payload ?? {};
      if (typeof productId !== 'string' || !productId || typeof quantity !== 'number' || isNaN(quantity)) {
        console.warn('[CartContext] Invalid UPDATE_QUANTITY payload:', action.payload);
        return state;
      }

      const integerQuantity = Math.floor(quantity); // Ensure integer quantity

      // If quantity is 0 or less, treat it as a removal
      if (integerQuantity <= 0) {
        const newItems = state.items.filter((item) => item.productId !== productId);
        if (newItems.length === 0) {
          return initialCartState; // Reset if cart becomes empty
        } else {
          return { ...state, items: newItems };
        }
      }

      // Find item and update quantity if it exists
      const existingItemIndex = state.items.findIndex(
        (item) => item.productId === productId
      );

      if (existingItemIndex >= 0) {
        const newItemsArray = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: integerQuantity }
            : item
        );
        return { ...state, items: newItemsArray };
      } else {
        // Item not found, don't change state
        if (process.env.NODE_ENV === 'development') {
            console.warn(`[CartContext] UPDATE_QUANTITY: Item with productId ${productId} not found in cart.`);
        }
        return state;
      }
    }

    case 'CLEAR_CART': {
      return initialCartState;
    }

    default: {
      // Throw for unhandled actions to catch errors during development
      throw new Error(`[CartContext] Unhandled action type: ${action.type}`);
    }
  }
};

// --- Context Definition ---

/**
 * React Context object for the shopping cart.
 * Provides access to cart state and action dispatchers.
 * @type {React.Context<CartState & { addItem: Function, removeItem: Function, updateQuantity: Function, clearCart: Function } | undefined>}
 */
const CartContext = createContext(undefined);

// --- Provider Component ---

/**
 * Provides the CartContext to its children components.
 * Manages the cart state using a reducer and exposes state and action dispatchers.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The child components that will consume the context.
 * @returns {JSX.Element} The CartContext Provider wrapping the children.
 */
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  /**
   * Adds an item to the cart. If the item is from a different store
   * than the items currently in the cart, the cart will be cleared
   * and the new item will be added. If the item already exists in the
   * cart (from the same store), its quantity will be incremented.
   * @param {{productId: string, name: string, price: number}} item - The item details to add.
   * @param {string} storeId - The ID of the store the item belongs to.
   * @returns {void}
   */
  const addItem = useCallback((item, storeId) => {
    // Basic validation before dispatching
    if (!item || typeof item.productId !== 'string' || typeof item.name !== 'string' || typeof item.price !== 'number' || typeof storeId !== 'string' || !storeId) {
        console.error("Invalid item or storeId passed to addItem", { item, storeId });
        return;
    }
     if (item.price < 0) {
        console.error("Item price cannot be negative", { item });
        return;
     }
    dispatch({ type: 'ADD_ITEM', payload: { item, storeId } });
  }, []); // No dependencies, dispatch is stable

  /**
   * Removes an item completely from the cart based on its productId.
   * @param {string} productId - The unique ID of the product to remove.
   * @returns {void}
   */
  const removeItem = useCallback((productId) => {
     if (typeof productId !== 'string' || !productId) {
        console.error("Invalid productId passed to removeItem", productId);
        return;
     }
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  }, []);

  /**
   * Updates the quantity of a specific item in the cart.
   * If the quantity is set to 0 or less, the item is removed from the cart.
   * @param {string} productId - The unique ID of the product to update.
   * @param {number} quantity - The new quantity for the item (must be an integer).
   * @returns {void}
   */
  const updateQuantity = useCallback((productId, quantity) => {
    if (typeof productId !== 'string' || !productId || typeof quantity !== 'number' || isNaN(quantity)) {
      console.error("Invalid productId or quantity passed to updateQuantity", { productId, quantity });
      return;
    }
    // Reducer handles the logic for quantity <= 0
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  }, []);

  /**
   * Removes all items from the cart and resets the storeId.
   * @returns {void}
   */
  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders of consumers
  // unless the state (storeId, items) or the action functions change (which they won't due to useCallback).
  const contextValue = useMemo(() => ({
    storeId: state.storeId,
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }), [state.storeId, state.items, addItem, removeItem, updateQuantity, clearCart]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Runtime prop type validation for CartProvider
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// --- Custom Hook ---

/**
 * Custom hook to easily access the CartContext value (state and actions).
 * Ensures the hook is used within a component wrapped by CartProvider.
 * @returns {{storeId: string | null, items: CartItem[], addItem: Function, removeItem: Function, updateQuantity: Function, clearCart: Function}} The cart context value.
 * @throws {Error} If used outside of a CartProvider.
 *
 * @test Ensure hook throws error when used outside provider.
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    // This error is crucial for development to ensure correct usage
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

</code>