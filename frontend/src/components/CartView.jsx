<?xml version="1.0" encoding="UTF-8"?><code language="javascript">
// frontend/src/components/CartView.jsx
import React, { useMemo } from 'react';
import { Box, Table, Text, Group, NumberInput, ActionIcon, Alert, Title } from '@mantine/core';
import { IconTrash, IconShoppingCart } from '@tabler/icons-react'; // Assuming @tabler/icons-react is used
import { useCart } from '../context/CartContext.jsx';

// Optional: Define a simple inline currency formatter if helpers.js is not guaranteed
// const formatCurrency = (amount) => {
//   // Basic implementation, consider localization for production
//   return `$${amount.toFixed(2)}`;
// };

/**
 * Displays the current contents of the shopping cart, allows quantity adjustments,
 * item removal, and shows the total price. Handles empty cart state.
 * Relies on CartContext for data and actions.
 */
function CartView() {
  // Consume the cart state and actions from the context
  const { items, removeItem, updateQuantity } = useCart();

  // Calculate the total price of items in the cart
  // Memoize the calculation to avoid recomputing on every render unless items change
  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => {
      // Validate price and quantity before adding to sum
      const price = typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0;
      const quantity = typeof item.quantity === 'number' && Number.isInteger(item.quantity) ? item.quantity : 0;
      return sum + price * quantity;
    }, 0);
  }, [items]); // Dependency array: recalculate only when items change

  // Handle the empty cart scenario
  if (items.length === 0) {
    return (
      <Alert
        icon={<IconShoppingCart size={18} />}
        title="Cart Empty"
        color="blue"
        radius="md"
        mt="md"
        variant="light"
      >
        Your shopping cart is currently empty. Add some items from a store!
      </Alert>
    );
  }

  // Generate table rows from cart items
  const rows = items.map((item) => {
     // Calculate item subtotal safely
     const itemPrice = typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0;
     const itemQuantity = typeof item.quantity === 'number' && Number.isInteger(item.quantity) ? item.quantity : 0;
     const itemTotal = itemPrice * itemQuantity;

    return (
      <Table.Tr key={item.productId}>
        <Table.Td>
          <Text size="sm" fw={500}>{item.name || 'N/A'}</Text>
        </Table.Td>
        <Table.Td ta="right">
          {/* Basic price formatting */}
          <Text size="sm">₹{itemPrice.toFixed(2)}</Text>
        </Table.Td>
        <Table.Td>
          <NumberInput
            value={itemQuantity}
            onChange={(value) => {
              // Ensure value is treated as a number, default to 0 if invalid
              const newQuantity = typeof value === 'number' ? value : 0;
              updateQuantity(item.productId, newQuantity);
            }}
            min={1} // Minimum quantity via input controls
            max={99} // Reasonable upper limit
            step={1}
            size="xs"
            style={{ width: '70px' }} // Limit width
            aria-label={`Quantity for ${item.name}`}
          />
        </Table.Td>
        <Table.Td ta="right">
          <Text size="sm" fw={500}>₹{itemTotal.toFixed(2)}</Text>
        </Table.Td>
        <Table.Td>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => removeItem(item.productId)}
            aria-label={`Remove ${item.name} from cart`}
            title={`Remove ${item.name}`} // Tooltip for hover
          >
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    );
  });

  // Render the cart table and total
  return (
    <Box mt="md">
      <Title order={4} mb="sm">Shopping Cart</Title>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product</Table.Th>
            <Table.Th ta="right">Price</Table.Th>
            <Table.Th ta="center">Quantity</Table.Th>
            <Table.Th ta="right">Total</Table.Th>
            <Table.Th ta="center">Remove</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Group justify="flex-end" mt="lg">
        <Text size="lg" fw={700}>
          Grand Total: ₹{totalPrice.toFixed(2)}
        </Text>
      </Group>
    </Box>
  );
}

// Using React.memo for potential performance optimization if parent re-renders often,
// though likely not strictly necessary given context usage usually handles this.
// However, demonstrating best practice for potentially expensive components.
export default React.memo(CartView);

</code>