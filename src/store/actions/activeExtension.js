export const SET_ACTIVE_EXTENSION = "SET_ACTIVE_EXTENSION";

/**
 * Get action to set active extension.
 *
 * @param {object} extension Active extension
 * @returns {object} Action
 */
export const setActiveExtension = extension => ({
  type: SET_ACTIVE_EXTENSION,
  payload: extension
});
