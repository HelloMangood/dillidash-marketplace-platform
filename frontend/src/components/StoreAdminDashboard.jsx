<?xml version="1.0" encoding="UTF-8"?><code language="javascript">
// frontend/src/components/StoreAdminDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Tabs,
  Table,
  Text,
  Loader,
  Alert,
  Title,
  Group,
  Badge,
  Center,
  Stack,
  ScrollArea,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconClipboardList,
  IconPackage,
  // IconReceipt is imported but not used in MVP, kept for potential future use
} from '@tabler/icons-react';
import { fetchStoreOrders, fetchStoreProducts } from '../services/apiService.js';

/**
 * @typedef {import('../services/apiService.js').Order} Order
 * @typedef {import('../services/apiService.js').Product} Product
 */

/**
 * Maps order status strings to Mantine Badge colors for visual consistency.
 * @param {string} status - The order status string.
 * @returns {string} A Mantine color name.
 */
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'placed':
      return 'blue';
    case 'accepted':
      return 'yellow';
    case 'out_for_delivery':
      return 'orange';
    case 'delivered':
      return 'green';
    case 'cancelled':
      return 'gray';
    default:
      return 'gray'; // Default color for unknown statuses
  }
};

/**
 * Formats a number as Indian Rupees (₹).
 * Handles null or undefined values gracefully.
 * @param {number | null | undefined} amount - The numeric amount.
 * @returns {string} Formatted currency string (e.g., "₹1,234.56") or "N/A".
 */
const formatCurrency = (amount) => {
    if (amount === null || typeof amount === 'undefined' || isNaN(amount)) {
        return 'N/A';
    }
    // Using Intl for better localization support in the future, basic for now
    return `₹${amount.toFixed(2)}`;
};

/**
 * Formats a date string into a more readable local date format.
 * Handles invalid date strings gracefully.
 * @param {string | null | undefined} dateString - The date string (e.g., from ISO format).
 * @returns {string} Formatted date string or "Invalid Date".
 */
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString();
    } catch (e) {
        console.warn(`[StoreAdminDashboard] Error formatting date: ${dateString}`, e);
        return 'Invalid Date';
    }
};


/**
 * StoreAdminDashboard component displays orders and products for a specific store.
 * It fetches data based on the provided storeId prop and organizes the information into tabs.
 *
 * @component
 * @param {object} props - Component props.
 * @param {string} props.storeId - The unique MongoDB ObjectId string of the store.
 */
function StoreAdminDashboard({ storeId }) {
  /** @type {[Order[], React.Dispatch<React.SetStateAction<Order[]>>]} */
  const [orders, setOrders] = useState([]);
  /** @type {[Product[], React.Dispatch<React.SetStateAction<Product[]>>]} */
  const [products, setProducts] = useState([]);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [isLoading, setIsLoading] = useState(true);
  /** @type {[Error | null, React.Dispatch<React.SetStateAction<Error | null>>]} */
  const [error, setError] = useState(null);
  /** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
  const [activeTab, setActiveTab] = useState('orders');

  // Fetch data when storeId changes
  useEffect(() => {
    const fetchData = async () => {
      // Validate storeId before fetching
      if (!storeId || typeof storeId !== 'string' || storeId.trim().length === 0) {
        if (process.env.NODE_ENV === 'development') {
            console.error('[StoreAdminDashboard] Invalid or missing storeId prop.');
        }
        setError(new Error('Store ID is missing or invalid. Cannot load dashboard.'));
        setIsLoading(false);
        setOrders([]); // Clear any previous data
        setProducts([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      setOrders([]); // Clear previous data on new fetch
      setProducts([]);

      try {
        // Fetch orders and products concurrently
        const results = await Promise.allSettled([
          fetchStoreOrders(storeId),
          fetchStoreProducts(storeId),
        ]);

        const orderResult = results[0];
        const productResult = results[1];
        let collectedErrors = [];

        // Process order results
        if (orderResult.status === 'fulfilled') {
          setOrders(orderResult.value || []);
        } else {
          console.error('[StoreAdminDashboard] Failed to fetch orders:', orderResult.reason);
          collectedErrors.push(`Orders: ${orderResult.reason?.message || 'Unknown error'}`);
        }

        // Process product results
        if (productResult.status === 'fulfilled') {
          setProducts(productResult.value || []);
        } else {
          console.error('[StoreAdminDashboard] Failed to fetch products:', productResult.reason);
          collectedErrors.push(`Products: ${productResult.reason?.message || 'Unknown error'}`);
        }

        // Set aggregated error state if any promise rejected
        if (collectedErrors.length > 0) {
          setError(new Error(`Failed to load data. ${collectedErrors.join('. ')}`));
        }

      } catch (err) {
        // Catch unexpected errors during the Promise.allSettled or setup phase
        console.error('[StoreAdminDashboard] Unexpected error during data fetch:', err);
        setError(new Error('An unexpected error occurred while loading dashboard data.'));
      } finally {
        // Ensure loading state is turned off regardless of success or failure
        setIsLoading(false);
      }
    };

    fetchData();
  }, [storeId]); // Dependency array ensures effect runs when storeId changes

  // Render loading state
  if (isLoading) {
    return (
      <Center style={{ padding: '40px 0' }}>
        <Loader color="blue" type="bars" />
        <Text ml="sm">Loading dashboard data...</Text>
      </Center>
    );
  }

  // Render error state
  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size={18} />}
        title="Error Loading Data"
        color="red"
        radius="md"
        mt="md"
        variant="light"
      >
        {error.message || 'An unexpected error occurred.'}
      </Alert>
    );
  }

  // Generate rows for the Orders table
  const orderRows = orders.map((order) => (
    <Table.Tr key={order._id}>
      <Table.Td><Text size="xs" title={order._id}>{order._id ? order._id.slice(-6) : 'N/A'}</Text></Table.Td>
      <Table.Td><Text size="sm">{order.customerDetails?.name || 'N/A'}</Text></Table.Td>
      <Table.Td><Text size="sm">{order.customerDetails?.phone || 'N/A'}</Text></Table.Td>
      <Table.Td ta="center"><Text size="sm">{order.items?.length || 0}</Text></Table.Td>
      <Table.Td ta="right"><Text size="sm" fw={500}>{formatCurrency(order.totalAmount)}</Text></Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(order.status)} variant="light" radius="sm">
          {order.status || 'Unknown'}
        </Badge>
      </Table.Td>
      <Table.Td><Text size="xs">{formatDate(order.createdAt)}</Text></Table.Td>
    </Table.Tr>
  ));

  // Generate rows for the Products table
  const productRows = products.map((product, index) => (
    // Using index as key is acceptable here if products don't have unique stable IDs (though _id should exist if fetched properly)
    // Prefer using product._id if available and guaranteed unique within the list fetched
    <Table.Tr key={product._id || `product-${index}`}>
      <Table.Td><Text size="sm">{product.name || 'N/A'}</Text></Table.Td>
      <Table.Td><Text size="sm">{product.category || 'N/A'}</Text></Table.Td>
      <Table.Td ta="right"><Text size="sm" fw={500}>{formatCurrency(product.price)}</Text></Table.Td>
    </Table.Tr>
  ));

  // Render the main dashboard content with Tabs
  return (
    <Box mt="md">
      <Title order={2} mb="lg">Store Dashboard</Title>
      <Tabs value={activeTab} onChange={setActiveTab} variant="outline" radius="md">
        <Tabs.List>
          <Tabs.Tab value="orders" leftSection={<IconClipboardList size={16} />}>
            Orders ({orders.length})
          </Tabs.Tab>
          <Tabs.Tab value="products" leftSection={<IconPackage size={16} />}>
            Products ({products.length})
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="orders" pt="lg">
          <Stack gap="md">
            <Title order={4}>Incoming Orders</Title>
            {orders.length === 0 ? (
              <Text c="dimmed">No orders found for this store.</Text>
            ) : (
              <ScrollArea h={500}>
                <Table striped highlightOnHover withTableBorder withColumnBorders verticalSpacing="xs">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Order ID</Table.Th>
                      <Table.Th>Customer</Table.Th>
                      <Table.Th>Phone</Table.Th>
                      <Table.Th ta="center">Items</Table.Th>
                      <Table.Th ta="right">Total</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Date</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{orderRows}</Table.Tbody>
                </Table>
              </ScrollArea>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="products" pt="lg">
          <Stack gap="md">
            <Title order={4}>Product Listings</Title>
            {products.length === 0 ? (
              <Text c="dimmed">No products listed for this store.</Text>
            ) : (
              <ScrollArea h={500}>
                <Table striped highlightOnHover withTableBorder withColumnBorders verticalSpacing="xs">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Category</Table.Th>
                      <Table.Th ta="right">Price</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{productRows}</Table.Tbody>
                </Table>
              </ScrollArea>
            )}
            {/* Placeholder for Add/Edit Product controls - Post-MVP */}
             {/* <Group justify="flex-end" mt="md"><Button size="sm">Add New Product</Button></Group> */}
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}

// Prop type validation
StoreAdminDashboard.propTypes = {
  storeId: PropTypes.string.isRequired,
};

export default StoreAdminDashboard;
</code>