// frontend/src/pages/StorePage.jsx
import React, { useState, useEffect, memo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, // Using Stack or Box for primary layout instead
  Stack,
  Title,
  Text,
  LoadingOverlay, // Using Loader within Center instead of Overlay
  Alert,
  Loader,
  Center,
  Box,
  Divider,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

import { fetchStoreDetails, fetchStoreProducts } from '../services/apiService.js';
import ProductList from '../components/ProductList.jsx';

/**
 * @typedef {import('../services/apiService.js').Store} Store
 * @typedef {import('../services/apiService.js').Product} Product
 */

/**
 * StorePage Component
 * Displays detailed information about a single store (name, address) and
 * lists its available products using the ProductList component.
 * Retrieves the store ID from the URL and fetches data using apiService.
 */
function StorePage() {
  // Get the storeId from the URL parameters
  const { storeId } = useParams();

  // Component state management
  /** @type {[Store | null, React.Dispatch<React.SetStateAction<Store | null>>]} */
  const [storeInfo, setStoreInfo] = useState(null);
  /** @type {[Product[], React.Dispatch<React.SetStateAction<Product[]>>]} */
  const [products, setProducts] = useState([]);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [isLoading, setIsLoading] = useState(true);
  /** @type {[Error | null, React.Dispatch<React.SetStateAction<Error | null>>]} */
  const [error, setError] = useState(null);

  // Effect hook for fetching data when storeId changes
  useEffect(() => {
    const fetchData = async () => {
      // Validate storeId before proceeding
      if (!storeId || typeof storeId !== 'string' || storeId.trim().length === 0) {
        setError(new Error('Invalid store ID provided in URL.'));
        setIsLoading(false);
        setStoreInfo(null); // Clear previous data
        setProducts([]);
        return; // Stop execution
      }

      // Reset state for new fetch
      setIsLoading(true);
      setError(null);
      setStoreInfo(null);
      setProducts([]);

      try {
        // Fetch store details and products concurrently
        const results = await Promise.allSettled([
          fetchStoreDetails(storeId),
          fetchStoreProducts(storeId),
        ]);

        const detailsResult = results[0];
        const productsResult = results[1];
        let collectedErrors = [];

        // Process store details result
        if (detailsResult.status === 'fulfilled') {
          // Ensure the response looks like a valid store object
          if (detailsResult.value && typeof detailsResult.value === 'object' && detailsResult.value._id) {
            setStoreInfo(detailsResult.value);
          } else {
            collectedErrors.push('Invalid store details format received.');
             if (process.env.NODE_ENV === 'development') {
               console.warn('[StorePage] Invalid store details response:', detailsResult.value);
             }
             setStoreInfo(null); // Set to null if data is invalid
          }
        } else {
          collectedErrors.push(`Failed to fetch store details: ${detailsResult.reason?.message || 'Unknown error'}`);
          if (process.env.NODE_ENV === 'development') {
            console.error('[StorePage] Error fetching store details:', detailsResult.reason);
          }
        }

        // Process products result
        if (productsResult.status === 'fulfilled') {
          // Ensure the response is an array
          setProducts(Array.isArray(productsResult.value) ? productsResult.value : []);
        } else {
          collectedErrors.push(`Failed to fetch store products: ${productsResult.reason?.message || 'Unknown error'}`);
          if (process.env.NODE_ENV === 'development') {
            console.error('[StorePage] Error fetching store products:', productsResult.reason);
          }
           setProducts([]); // Set empty array on error
        }

        // Set combined error state if any fetch failed
        if (collectedErrors.length > 0) {
          setError(new Error(`Failed to load store information. ${collectedErrors.join(' ')}`));
           // If details failed specifically, ensure storeInfo is null
           if (detailsResult.status === 'rejected') {
               setStoreInfo(null);
           }
        }

      } catch (err) {
        // Catch unexpected errors during the Promise handling itself
        console.error('[StorePage] Unexpected error during data fetch:', err);
        setError(new Error('An unexpected error occurred while loading the store page.'));
        setStoreInfo(null);
        setProducts([]);
      } finally {
        // Ensure loading state is always set to false after fetching attempt
        setIsLoading(false);
      }
    };

    fetchData();
  }, [storeId]); // Dependency array: re-run effect if storeId changes

  // --- Render Logic ---

  // Loading State
  if (isLoading) {
    return (
      <Center style={{ height: '60vh', padding: '40px 0' }}>
        <Loader color="blue" type="bars" />
        <Text ml="sm">Loading store details...</Text>
      </Center>
    );
  }

  // Error State
  if (error) {
    return (
      <Box mt="lg">
        <Alert
          icon={<IconAlertCircle size={18} />}
          title="Error Loading Store"
          color="red"
          radius="md"
          variant="light"
        >
          {error.message || 'An unexpected error occurred.'}
        </Alert>
      </Box>
    );
  }

  // Data Loaded State (Success or partial success)
  return (
    <Stack gap="lg">
      {/* Store Details Section */}
      {storeInfo ? (
        <Box>
          <Title order={2} mb="xs">{storeInfo.name || 'Store Name Unavailable'}</Title>
          <Text size="sm" c="dimmed">
            {storeInfo.address?.city || 'City Unavailable'}, {storeInfo.address?.pincode || 'Pincode Unavailable'}
            {/* Optional: Add more details like street if available and needed */}
            {/* {storeInfo.address?.street && `, ${storeInfo.address.street}`} */}
          </Text>
          {/* Potential place for other store details like phone, categories etc. */}
        </Box>
      ) : (
        // Render a message if storeInfo failed to load even if products didn't error out
         <Alert
          icon={<IconAlertCircle size={16} />}
          title="Store Details Unavailable"
          color="orange"
          radius="sm"
          variant="light"
          mb="lg"
        >
          Could not load store details. Products might still be displayed below if available.
        </Alert>
      )}

      {/* Divider */}
      <Divider my="md" />

      {/* Product List Section */}
      <Box>
        <Title order={3} mb="md">Products</Title>
        {/*
          Pass the validated storeId.
          Pass isLoading=false and error=null because page-level loading/error is handled above.
          ProductList component itself handles the case where the `products` array is empty.
        */}
        <ProductList
          products={products}
          storeId={storeId} // Pass the validated storeId
          isLoading={false} // Let the page handle overall loading
          error={null}      // Let the page handle overall errors
        />
      </Box>
    </Stack>
  );
}

// Export the component, memoized for consistency and potential optimization
export default memo(StorePage);