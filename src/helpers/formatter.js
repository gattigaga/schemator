/**
 * Make capital string
 *
 * @param {string} words String you want to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = words =>
  words.charAt(0).toUpperCase() + words.substr(1);
