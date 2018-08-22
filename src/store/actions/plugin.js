export const SET_PLUGIN = "SET_PLUGIN";

/**
 * Get action to set plugin would be activated.
 *
 * @param {object} plugin Plugin would be activated.
 * @returns {object} Action.
 */
export const setPlugin = plugin => ({
  type: SET_PLUGIN,
  payload: plugin
});
