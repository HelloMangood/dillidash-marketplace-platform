// frontend/src/pages/StoreAdminPage.jsx
import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Title, Alert, Box } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

// Import the dashboard component
import StoreAdminDashboard from '../components/StoreAdminDashboard.jsx';

/**
 * StoreAdminPage Component
 *
 * Serves as the container for the store administration interface.
 * It retrieves the store ID from the URL parameters and renders the
 * administrative dashboard for that specific store. Handles cases where
 * the store ID might be missing or invalid from the URL.
 */
function StoreAdminPage() {
  // Extract the dynamic storeId parameter from the URL using React Router's hook
  const { storeId } = useParams();

  // Validate the storeId extracted from the URL parameters.
  // It must be present and a non-empty string.
  const isStoreIdValid = storeId && typeof storeId === 'string' && storeId.trim().length > 0;

  return (
    // Use Box for consistent layout structure, similar to other pages
    <Box>
      {/* Optional Title for the page */}
      <Title order={2} mb="lg">
        Store Administration
      </Title>

      {/* Conditional Rendering based on storeId validity */}
      {!isStoreIdValid ? (
        // Render an error Alert if the storeId is invalid or missing
        <Alert
          icon={<IconAlertCircle size={18} />}
          title="Invalid Store Access"
          color="red"
          radius="md"
          mt="md" // Add margin top for spacing
          variant="light"
        >
          The store ID is missing or invalid in the URL. Cannot load the dashboard.
        </Alert>
      ) : (
        // Render the StoreAdminDashboard component if the storeId is valid,
        // passing the validated storeId as a prop.
        <StoreAdminDashboard storeId={storeId} />
      )}
    </Box>
  );
}

// Export the component, wrapped with React.memo for potential performance optimization
// consistent with other page components in the MVP.
export default memo(StoreAdminPage);