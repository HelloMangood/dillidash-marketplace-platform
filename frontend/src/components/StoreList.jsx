<?xml version="1.0" encoding="UTF-8"?><code language="javascript">
// frontend/src/components/StoreList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  SimpleGrid,
  Card,
  Text,
  Badge,
  Group,
  Center,
  Box, // Added for consistent outer spacing
} from '@mantine/core';

/**
 * Renders a responsive grid of store cards based on an array of store data.
 * Each card links to the specific store's detail page. Handles the empty state.
 * Assumes loading and error states are handled by the parent component.
 *
 * @component
 * @param {object} props - Component props.
 * @param {Array<object>} props.stores - Array of store objects to display.
 */
function StoreList({ stores }) {
  // Development-only warning for required prop validation
  if (process.env.NODE_ENV === 'development') {
    if (!Array.isArray(stores)) {
      console.warn('[StoreList] Invalid prop: `stores` should be an array.');
      // Render nothing or an error state if prop is fundamentally wrong
      return (
        <Center style={{ padding: '40px 0' }}>
          <Text c="red" fw={500}>Error: Invalid 'stores' prop provided.</Text>
        </Center>
      );
    }
  }

  // Handle Empty State: No stores found matching criteria
  if (stores.length === 0) {
    return (
      <Center style={{ padding: '40px 0' }}>
        <Text c="dimmed">No stores found matching your criteria.</Text>
      </Center>
    );
  }

  // Generate Store Cards
  const storeCards = stores.map((store) => {
    // Validate essential store data before attempting to render a card
    if (
      !store ||
      typeof store._id !== 'string' ||
      !store._id ||
      typeof store.name !== 'string' ||
      !store.name ||
      typeof store.address !== 'object' ||
      !store.address ||
      typeof store.address.pincode !== 'string' ||
      !store.address.pincode
    ) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[StoreList] Skipping rendering of invalid store data:', store);
      }
      return null; // Skip rendering this invalid item
    }

    // Construct address string (Pincode is required, City is optional)
    const addressString = store.address.city
      ? `${store.address.city}, ${store.address.pincode}`
      : store.address.pincode;

    return (
      // Use store._id as the unique key for React's list rendering
      <Card
        key={store._id}
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        component={Link} // Make the entire card clickable and act as a Link
        to={`/store/${store._id}`} // Dynamic route based on store ID
        style={{ textDecoration: 'none' }} // Remove default link underline
      >
        {/* Store Name */}
        <Text fw={500} size="lg" mb="xs" lineClamp={1}>
          {store.name}
        </Text>

        {/* Address Info */}
        <Text size="sm" c="dimmed" mb="md">
          {addressString}
        </Text>

        {/* Categories Badges */}
        {Array.isArray(store.categories) && store.categories.length > 0 && (
          <Group gap="xs" wrap="wrap">
            {store.categories.map((category, index) => (
              // Use category + index for key if category names aren't guaranteed unique
              <Badge key={`${category}-${index}`} color="blue" variant="light" size="xs">
                {category}
              </Badge>
            ))}
          </Group>
        )}
      </Card>
    );
  });

  // Render the grid containing the store cards
  return (
    <Box mt="lg"> {/* Consistent spacing */}
      <SimpleGrid
        cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 5 }} // Responsive column layout
        spacing="lg" // Horizontal spacing
        verticalSpacing="lg" // Vertical spacing
      >
        {/* Filter out any nulls from validation failures */}
        {storeCards.filter(Boolean)}
      </SimpleGrid>
    </Box>
  );
}

// --- Prop Type Validation ---
StoreList.propTypes = {
  stores: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.shape({
        pincode: PropTypes.string.isRequired,
        city: PropTypes.string, // Optional city
        // street is not required for display here based on MVP needs
      }).isRequired,
      categories: PropTypes.arrayOf(PropTypes.string), // Optional categories
      // Other store fields might exist but are not used in this component
    })
  ).isRequired,
};

// Export with React.memo for potential performance optimization,
// though its effectiveness depends on how the parent manages the `stores` prop.
export default React.memo(StoreList);
</code>