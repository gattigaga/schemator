/**
 * Get random value between min and max value
 *
 * @param {number} min Minimum value
 * @param {number} max Maximum value
 * @returns {number} Random value
 */
export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
