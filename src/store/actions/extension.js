export const SET_EXTENSION = "SET_EXTENSION";

/**
 * Get action to set active extension.
 *
 * @param {object} extension Active extension.
 * @returns {object} Action.
 */
export const setExtension = extension => ({
  type: SET_EXTENSION,
  payload: extension
});
