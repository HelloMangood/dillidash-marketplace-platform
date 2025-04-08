// frontend/src/pages/CheckoutPage.jsx
import React from 'react';
import { Container, Title, Stack, Alert, Text, Divider, Button } from '@mantine/core';
import { IconShoppingCartOff } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

import { useCart } from '../context/CartContext.jsx';
import CartView from '../components/CartView.jsx';
import CheckoutForm from '../components/CheckoutForm.jsx';

/**
 * CheckoutPage Component
 * Serves as the container for the checkout process.
 * Conditionally displays either an empty cart message or the cart summary and checkout form.
 */
function CheckoutPage() {
  // Retrieve cart items from the CartContext
  const { items } = useCart();

  // Conditional rendering based on cart content
  if (items.length === 0) {
    // Render empty cart message and link back to home
    return (
      <Container py="xl">
        <Alert
          icon={<IconShoppingCartOff size={18} />}
          title="Your Cart is Empty"
          color="blue"
          radius="md"
          variant="light"
        >
          <Text>
            You need to add items to your cart before proceeding to checkout.
          </Text>
        </Alert>
        <Button
          component={Link}
          to="/"
          mt="md"
          variant="light"
          fullWidth
        >
          Continue Shopping
        </Button>
      </Container>
    );
  } else {
    // Render the main checkout interface when cart is not empty
    return (
      <Stack gap="lg">
        <Title order={2} mb="lg">
          Checkout
        </Title>

        {/* Display the cart summary */}
        <CartView />

        {/* Visual separation */}
        <Divider my="lg" />

        {/* Display the guest details and submission form */}
        <CheckoutForm />
      </Stack>
    );
  }
}

// Export the component, wrapped with React.memo for potential performance optimization
export default React.memo(CheckoutPage);