/**
 * Formats a number to a maximum of 2 decimal places.
 * If the number is an integer, it returns it as is.
 * If it has decimals, it rounds to 2 places and trims trailing zeros.
 * @param {number|string} val 
 * @returns {string}
 */
export const formatCurrency = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) return "0";
  
  // toFixed(2) rounds correctly, then parseFloat trims unnecessary trailing zeros (.50 -> .5, .00 -> no decimal)
  return parseFloat(num.toFixed(2)).toLocaleString("en-IN");
};
