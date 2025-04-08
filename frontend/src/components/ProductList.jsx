<?xml version="1.0" encoding="UTF-8"?><code language="javascript">
// frontend/src/components/ProductList.jsx
import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  SimpleGrid,
  Card,
  Text,
  Button,
  Group,
  Loader,
  Alert,
  Center,
  Image, // Included for future use placeholder
  Badge,
  Box
} from '@mantine/core';
import { IconAlertCircle, IconShoppingCartPlus } from '@tabler/icons-react';
import { useCart } from '../context/CartContext.jsx';

/**
 * Renders a grid of product cards based on data received via props.
 * Handles loading, error, and empty states. Allows adding products to the cart.
 *
 * @component
 * @param {object} props - Component props.
 * @param {Array<object>} props.products - Array of product objects to display.
 * @param {string} props.storeId - The ID of the store these products belong to.
 * @param {boolean} [props.isLoading=false] - Indicates if products are currently being loaded.
 * @param {object | null} [props.error=null] - An error object if fetching products failed.
 */
function ProductList({ products, storeId, isLoading = false, error = null }) {
  const { addItem } = useCart();

  // Development-only warnings for required props
  if (process.env.NODE_ENV === 'development') {
    if (!Array.isArray(products)) {
      console.warn('[ProductList] Invalid prop: `products` should be an array.');
    }
    if (typeof storeId !== 'string' || !storeId) {
      console.warn('[ProductList] Invalid prop: `storeId` should be a non-empty string.');
    }
  }

  // Memoize the handler generation to potentially optimize if many products render
  const handleAddToCart = useCallback((product) => {
    // Validate product data before attempting to add to cart
    const { _id, name, price } = product || {};
    if (typeof _id !== 'string' || !_id || typeof name !== 'string' || !name || typeof price !== 'number' || isNaN(price) || price < 0) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('[ProductList] Attempted to add invalid product to cart:', product);
        }
        // Optionally disable button or show feedback instead of just warning
        return; // Prevent adding invalid item
    }
    // Validate storeId again just before use (might be redundant but safe)
    if (typeof storeId !== 'string' || !storeId) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('[ProductList] Invalid storeId when attempting to add item:', storeId);
        }
        return;
    }

    addItem({ productId: _id, name: name, price: price }, storeId);
  }, [addItem, storeId]); // Dependency array includes addItem and storeId

  // --- Render Logic based on State ---

  if (isLoading) {
    return (
      <Center style={{ padding: '40px 0' }}>
        <Loader color="blue" type="bars" />
        <Text ml="sm">Loading products...</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size={18} />}
        title="Error Loading Products"
        color="red"
        radius="md"
        mt="md"
        variant="light"
      >
        {error.message || 'An unexpected error occurred while loading products.'}
      </Alert>
    );
  }

  // Validate products prop *after* loading and error checks
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <Center style={{ padding: '40px 0' }}>
        <Text c="dimmed">No products found for this store.</Text>
      </Center>
    );
  }

  // --- Render Product Grid ---
  const productCards = products.map((product) => {
    // Basic validation for product structure within the map
    if (!product || typeof product._id !== 'string' || typeof product.name !== 'string' || typeof product.price !== 'number') {
        if (process.env.NODE_ENV === 'development') {
            console.warn('[ProductList] Skipping rendering of invalid product data:', product);
        }
        return null; // Skip rendering this invalid item
    }

    const isValidPrice = !isNaN(product.price) && product.price >= 0;
    const formattedPrice = isValidPrice ? `₹${product.price.toFixed(2)}` : 'N/A';

    return (
      <Card key={product._id} shadow="sm" padding="lg" radius="md" withBorder>
        {/* Image Placeholder Structure - uncomment and implement when image URLs are available */}
        {/*
        <Card.Section>
          <Image
            src={product.imageUrl || '/placeholder-image.svg'} // Use actual image URL or a placeholder
            height={160}
            alt={`Image of ${product.name}`}
            fallbackSrc="/placeholder-image.svg" // Fallback if src fails
          />
        </Card.Section>
        */}

        <Group justify="space-between" mt="md" mb="xs">
          {/* Product Name - Consider adding line clamp for very long names */}
          <Text fw={500} size="sm" lineClamp={2}>
             {product.name}
          </Text>
          {/* Optional Category Badge */}
          {product.category && (
            <Badge color="pink" variant="light" size="sm">
              {product.category}
            </Badge>
          )}
        </Group>

        {/* Product Price */}
        <Text size="md" c="blue" fw={600} mb="md">
          {formattedPrice}
        </Text>

        {/* Add to Cart Button */}
        <Button
          color="blue"
          fullWidth
          mt="md"
          radius="md"
          leftSection={<IconShoppingCartPlus size={16} />}
          onClick={() => handleAddToCart(product)}
          disabled={!isValidPrice} // Disable if price is invalid
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </Button>
      </Card>
    );
  });

  return (
    <Box mt="lg"> {/* Added margin top for spacing */}
      <SimpleGrid
        cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 5 }} // Responsive grid columns
        spacing="lg" // Spacing between grid items
        verticalSpacing="lg"
      >
        {productCards}
      </SimpleGrid>
    </Box>
  );
}

// --- Prop Type Validation ---
ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      category: PropTypes.string,
      // Add other expected product fields here if necessary
    })
  ).isRequired,
  storeId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.object, // Can be any error object shape
};

// --- Default Props ---
ProductList.defaultProps = {
  isLoading: false,
  error: null,
};

// Export with React.memo for performance optimization
export default React.memo(ProductList);

</code>