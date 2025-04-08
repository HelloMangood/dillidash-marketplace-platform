// frontend/src/utils/helpers.js
// Using ES Modules syntax as specified in frontend/package.json ("type": "module")

/**
 * Formats a numeric amount as Indian Rupees (₹) with two decimal places.
 * Handles invalid inputs gracefully by returning 'N/A' and logging a warning
 * in development mode.
 *
 * @param {number | string | null | undefined} amount - The numeric value or potentially string representation to format.
 * @returns {string} The formatted currency string (e.g., "₹123.00") or 'N/A'.
 * @example formatCurrency(1234.56) // Returns "₹1234.56"
 * @example formatCurrency('100') // Returns "₹100.00"
 * @example formatCurrency(-50) // Returns "₹-50.00"
 * @example formatCurrency(null) // Returns "N/A"
 * @example formatCurrency(undefined) // Returns "N/A"
 * @example formatCurrency('abc') // Returns "N/A"
 * @example formatCurrency(NaN) // Returns "N/A"
 */
const formatCurrency = (amount) => {
  // Convert string representations to number, handle null/undefined
  const numericAmount = (amount === null || typeof amount === 'undefined') ? NaN : Number(amount);

  // Check if the conversion resulted in a valid number
  if (isNaN(numericAmount)) {
    // Log warning only in development for easier debugging
    if (import.meta.env.MODE === 'development') {
      console.warn(`[formatCurrency] Invalid input received: ${amount}. Expected a number or numeric string.`);
    }
    return 'N/A'; // Return default string for invalid inputs
  }

  // Format the valid number to two decimal places and prepend the Rupee symbol
  // toFixed converts the number to a string with the specified decimal places.
  const formatted = numericAmount.toFixed(2);

  // Handle negative sign correctly by checking the original numericAmount
  // Note: `toFixed` handles the sign correctly, so this check might seem redundant,
  // but ensures clarity. Prepending ₹ is the main goal here.
  return `₹${formatted}`;
};

/**
 * Formats a date string or Date object into DD/MM/YYYY format using Indian locale conventions.
 * Handles invalid inputs gracefully by returning 'N/A' and logging a warning
 * in development mode.
 *
 * @param {string | Date | null | undefined} dateInput - The date string (expected ISO 8601 format) or a Date object.
 * @returns {string} The formatted date string (e.g., "28/07/2024") or 'N/A'.
 * @example formatDate('2024-07-28T10:30:00.000Z') // Returns "28/07/2024"
 * @example formatDate(new Date(2024, 6, 28)) // Returns "28/07/2024" (Note: month is 0-indexed)
 * @example formatDate(null) // Returns "N/A"
 * @example formatDate(undefined) // Returns "N/A"
 * @example formatDate('invalid-date') // Returns "N/A"
 */
const formatDate = (dateInput) => {
  // Handle null or undefined input immediately
  if (dateInput === null || typeof dateInput === 'undefined') {
    if (import.meta.env.MODE === 'development') {
      console.warn(`[formatDate] Invalid input received: ${dateInput}. Expected a date string or Date object.`);
    }
    return 'N/A';
  }

  try {
    // Attempt to create a Date object from the input
    const date = new Date(dateInput);

    // Check if the created date object is valid
    // `isNaN(date.getTime())` is a reliable way to check for invalid dates
    if (isNaN(date.getTime())) {
      if (import.meta.env.MODE === 'development') {
        console.warn(`[formatDate] Could not parse invalid date input: ${dateInput}`);
      }
      return 'N/A'; // Return default string for invalid dates
    }

    // Format the valid date using Indian locale (DD/MM/YYYY)
    // 'en-IN' locale typically results in DD/MM/YYYY format.
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',   // Ensure day is always two digits (e.g., 05)
      month: '2-digit',  // Ensure month is always two digits (e.g., 07)
      year: 'numeric',   // Full year (e.g., 2024)
    });
  } catch (error) {
    // Catch any unexpected errors during Date object creation or formatting
    if (import.meta.env.MODE === 'development') {
      console.error(`[formatDate] Error processing date input: ${dateInput}`, error);
    }
    return 'N/A'; // Return default string on error
  }
};

// Export the utility functions using named exports
export { formatCurrency, formatDate };