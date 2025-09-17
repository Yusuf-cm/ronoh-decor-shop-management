// src/utils/format.js

/**
 * Formats a number into the Ksh currency format.
 * @param {number | string} amount - The numerical value to format.
 * @returns {string} The formatted currency string, e.g., "Ksh 1,250.00".
 */
export const formatCurrency = (amount) => {
    const numericAmount = parseFloat(amount);
  
    if (isNaN(numericAmount)) {
      return 'Ksh 0.00'; // Return a default value if the input is not a number
    }
  
    // Use the Intl.NumberFormat for robust, locale-aware formatting
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(numericAmount);
  };