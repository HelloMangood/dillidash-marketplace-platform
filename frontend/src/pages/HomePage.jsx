// frontend/src/pages/HomePage.jsx
import React, { useState, useCallback, memo } from 'react';
import { Container, Title, Stack, LoadingOverlay, Alert, Box } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

import StoreSearch from '../components/StoreSearch.jsx';
import StoreList from '../components/StoreList.jsx';
import { fetchStoresByPincode } from '../services/apiService.js';

/**
 * @typedef {import('../services/apiService.js').Store} Store
 */

/**
 * HomePage Component
 * Serves as the main landing page for users to search for local stores via pincode
 * and view the corresponding list of stores. Manages search state and results display.
 */
function HomePage() {
  /** @type {[Store[], React.Dispatch<React.SetStateAction<Store[]>>]} */
  const [stores, setStores] = useState([]);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [isLoading, setIsLoading] = useState(false);
  /** @type {[Error | null, React.Dispatch<React.SetStateAction<Error | null>>]} */
  const [error, setError] = useState(null);

  /**
   * Handles the store search initiated by the StoreSearch component.
   * Fetches stores based on the provided pincode, updating loading, error,
   * and stores states accordingly.
   * @param {string} pincode - The 6-digit pincode entered by the user.
   * @returns {Promise<void>}
   */
  const handleSearch = useCallback(async (pincode) => {
    if (process.env.NODE_ENV === 'development') {
        console.log('[HomePage] Searching for pincode:', pincode);
    }
    setIsLoading(true);
    setError(null); // Clear previous errors
    setStores([]); // Clear previous results immediately

    try {
      const fetchedStores = await fetchStoresByPincode(pincode);
      // Ensure we always set an array, even if API returns something unexpected
      setStores(Array.isArray(fetchedStores) ? fetchedStores : []);
    } catch (err) {
       if (process.env.NODE_ENV === 'development') {
         console.error('[HomePage] Failed to fetch stores:', err);
       }
      // Store the error object to display its message
      setError(err instanceof Error ? err : new Error('An unknown error occurred during search.'));
    } finally {
      setIsLoading(false); // Ensure loading state is always turned off
    }
  }, []); // No dependencies needed as fetchStoresByPincode is stable

  return (
    <Stack gap="lg"> {/* Use Stack for vertical arrangement and spacing */}
      <Title order={1} ta="center"> {/* Main page title */}
        Find Local Stores Near You
      </Title>

      {/* Store Search Component */}
      <StoreSearch onSearch={handleSearch} isLoading={isLoading} />

      {/* Results Area: Loading Overlay, Error Alert, and Store List */}
      <Box pos="relative" mt="md"> {/* Relative position for overlay */}
        <LoadingOverlay
          visible={isLoading}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue', type: 'bars' }}
          zIndex={10} // Ensure overlay is above content but below modals/notifications if any
        />

        {/* Error Display */}
        {error && (
          <Alert
            icon={<IconAlertCircle size={18} />}
            title="Search Error"
            color="red"
            radius="md"
            withCloseButton={false} // No close button needed, new search clears it
            mb="lg" // Margin below the alert
            variant="light"
          >
            {/* Display error message, default if none exists */}
            {error.message || 'An unexpected error occurred during the search.'}
          </Alert>
        )}

        {/* Store List Display - Rendered even when loading/error to maintain structure */}
        {/* StoreList handles its own empty state internally */}
        <StoreList stores={stores} />
      </Box>
    </Stack>
  );
}

// Export the component, potentially memoized if performance analysis shows benefit.
// For a top-level page, memoization impact is often minimal unless parent re-renders unnecessarily.
export default memo(HomePage);