<?xml version="1.0" encoding="UTF-8"?><code language="javascript">
// frontend/src/components/StoreSearch.jsx
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { TextInput, Button, Group, Box } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

// Regular expression for validating a 6-digit Indian pincode
const PINCODE_REGEX = /^\d{6}$/;

/**
 * Renders a controlled input field for users to enter a 6-digit Indian pincode
 * and a button to initiate a search. It validates the input and calls the
 * `onSearch` callback with the valid pincode upon clicking the search button.
 * Reflects a loading state to disable interaction during search operations.
 *
 * @component
 * @param {object} props - Component props.
 * @param {(pincode: string) => void} props.onSearch - Callback function invoked with the validated 6-digit pincode when the search is triggered.
 * @param {boolean} [props.isLoading=false] - Indicates if a search is currently in progress, disabling the input and button.
 */
function StoreSearch({ onSearch, isLoading = false }) {
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState(null); // State to hold validation error message

  /**
   * Handles changes to the pincode input field.
   * Updates the pincode state and clears any existing validation errors.
   * Allows only digits and limits length implicitly via maxLength prop.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handlePincodeChange = (event) => {
    const newValue = event.currentTarget.value;
    // Update state only if it's digits or empty, respecting maxLength=6 from TextInput
    if (/^\d*$/.test(newValue)) {
        setPincode(newValue);
        // Clear error message as user types
        if (error) {
            setError(null);
        }
    }
  };

  /**
   * Validates the current pincode state.
   * @returns {boolean} True if the pincode is valid (6 digits), false otherwise.
   */
  const validatePincode = useCallback(() => {
    return PINCODE_REGEX.test(pincode);
  }, [pincode]); // Dependency: re-create validator if pincode changes (though regex is static)

  /**
   * Handles the search submission (either form submit or button click).
   * Validates the pincode and calls the onSearch callback if valid and not loading.
   * Sets an error message if validation fails.
   * @param {React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>} event - The form submission or button click event.
   */
  const handleSearchSubmit = useCallback((event) => {
    // Prevent default form submission if used within a form
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }

    if (isLoading) return; // Do nothing if already loading

    if (validatePincode()) {
      setError(null); // Clear any previous error
      onSearch(pincode); // Call the parent's search handler
    } else {
      // Set specific error message for invalid pincode
      setError('Please enter a valid 6-digit pincode.');
    }
  }, [pincode, isLoading, onSearch, validatePincode]); // Dependencies for the handler

  return (
    // Using Box and onSubmit for form behavior (including Enter key submission)
    <Box component="form" onSubmit={handleSearchSubmit} mb="lg">
      <Group align="flex-end" gap="sm">
        <TextInput
          label="Pincode"
          placeholder="Enter 6-digit pincode"
          value={pincode}
          onChange={handlePincodeChange}
          error={error} // Display validation error message
          maxLength={6} // Restrict input length
          inputMode="numeric" // Hint for numeric keyboard on mobile
          pattern="[0-9]*" // Further hint for numeric input
          disabled={isLoading} // Disable input when loading
          required // Indicate field is required semantically
          style={{ flexGrow: 1 }} // Allow input to take available space
          aria-describedby={error ? 'pincode-error' : undefined}
        />
        {error && <span id="pincode-error" style={{ display: 'none' }}>{error}</span>} {/* For screen readers */}

        <Button
          type="submit" // Works with the form's onSubmit
          loading={isLoading} // Show loading indicator and disable button
          disabled={isLoading} // Explicitly disable when loading
          leftSection={<IconSearch size={16} />}
          aria-label="Search for stores by pincode"
        >
          Search
        </Button>
      </Group>
    </Box>
  );
}

// --- Prop Type Validation ---
StoreSearch.propTypes = {
  /**
   * Callback function invoked with the validated 6-digit pincode when search is triggered.
   */
  onSearch: PropTypes.func.isRequired,
  /**
   * If true, indicates a search is in progress, disabling the input and button.
   */
  isLoading: PropTypes.bool,
};

// --- Default Props ---
StoreSearch.defaultProps = {
  isLoading: false,
};

// Export with React.memo for potential performance optimization.
// This prevents re-renders if props (onSearch, isLoading) haven't changed.
export default React.memo(StoreSearch);

</code>