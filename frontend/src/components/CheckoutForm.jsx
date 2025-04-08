<?xml version="1.0" encoding="UTF-8"?><code language="javascript">
// frontend/src/components/CheckoutForm.jsx
import React, { useState, useCallback } from 'react';
import {
  Box,
  TextInput,
  Textarea,
  Button,
  Group,
  LoadingOverlay,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications'; // Assuming provider is setup
import { IconCheck, IconX } from '@tabler/icons-react'; // Optional icons for notifications

import { useCart } from '../context/CartContext.jsx';
import { createOrder } from '../services/apiService.js';

/**
 * Renders a form for guest users to enter delivery details and submit their order.
 * Handles form state, validation, API interaction, and user feedback.
 */
function CheckoutForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, storeId, clearCart } = useCart();

  // Initialize Mantine form hook
  const form = useForm({
    initialValues: {
      name: '',
      phone: '',
      address: '',
    },
    validateInputOnBlur: true, // Validate fields when they lose focus
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Name is required'),
      phone: (value) =>
        /^[6-9]\d{9}$/.test(value)
          ? null
          : 'Please enter a valid 10-digit Indian mobile number',
      address: (value) =>
        value.trim().length > 0 ? null : 'Delivery address is required',
    },
  });

  // Memoized form submission handler
  const handleSubmit = useCallback(
    async (values) => {
      // Note: `values` directly comes from `form.values` on submit
      // Check cart state before proceeding
      if (items.length === 0 || !storeId) {
        notifications.show({
          title: 'Cannot Place Order',
          message: 'Your cart is empty or the store context is invalid. Please add items to your cart.',
          color: 'orange',
          icon: <IconX size={18} />,
        });
        return; // Stop submission
      }

      setIsSubmitting(true);

      // Construct the payload conforming to apiService.OrderPayload
      const orderData = {
        storeId: storeId,
        customerDetails: {
          name: values.name.trim(),
          phone: values.phone.trim(),
          address: values.address.trim(),
        },
        // Map cart items to the required structure for the backend
        items: items.map((item) => ({
          productId: item.productId, // Ensure CartContext uses the correct ID field
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      try {
        // Call the API service to create the order
        await createOrder(orderData);

        // SUCCESS: Show notification, clear cart, reset form
        notifications.show({
          title: 'Order Placed Successfully!',
          message: 'Your order has been received and is being processed.',
          color: 'green',
          icon: <IconCheck size={18} />,
          autoClose: 5000, // Close after 5 seconds
        });

        clearCart(); // Clear the cart context state
        form.reset(); // Reset form fields to initial values

      } catch (error) {
        // FAILURE: Show error notification
        console.error('[CheckoutForm] Order submission failed:', error);
        notifications.show({
          title: 'Order Placement Failed',
          // Use backend error message if available (from apiService), otherwise generic
          message: error?.message || 'An unexpected error occurred. Please check your details and try again.',
          color: 'red',
          icon: <IconX size={18} />,
        });
        // DO NOT clear the cart on failure, allow user to retry

      } finally {
        // Ensure loading state is always turned off
        setIsSubmitting(false);
      }
    },
    [items, storeId, clearCart, form] // Dependencies for useCallback
  );

  return (
    <Box pos="relative" mt="lg"> {/* Use margin-top instead of embedding in parent */}
      {/* Loading overlay covers the form during submission */}
      <LoadingOverlay
        visible={isSubmitting}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'blue', type: 'bars' }}
      />

      {/* Form element triggering the handleSubmit callback */}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md"> {/* Vertical spacing for form elements */}
          <TextInput
            withAsterisk
            label="Full Name"
            placeholder="Enter your full name"
            {...form.getInputProps('name')}
          />

          <TextInput
            withAsterisk
            label="Mobile Number"
            placeholder="Enter your 10-digit mobile number"
            type="tel" // Use 'tel' type for semantic meaning and potential mobile features
            {...form.getInputProps('phone')}
          />

          <Textarea
            withAsterisk
            label="Delivery Address"
            placeholder="Enter your full delivery address (including house/flat no., street, landmark, etc.)"
            minRows={3} // Suggest a minimum height
            autosize // Allow automatic resizing if needed
            {...form.getInputProps('address')}
          />

          {/* Submit button group */}
          <Group justify="flex-end" mt="md">
            <Button type="submit" loading={isSubmitting}>
              Place Order
            </Button>
          </Group>
        </Stack>
      </form>
    </Box>
  );
}

export default CheckoutForm;
</code>