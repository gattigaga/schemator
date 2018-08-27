export const SET_PLUGINS = "SET_PLUGINS";

/**
 * Get action to set plugin list.
 *
 * @param {object[]} plugins Plugin list.
 * @param {string} plugins[].id
 * @param {string} plugins[].name
 * @param {string} plugins[].author
 * @param {string} plugins[].description
 * @param {string} plugins[].license
 * @param {string} plugins[].version
 * @param {string} plugins[].icon
 * @returns {object} Action.
 */
export const setPlugins = plugins => ({
  type: SET_PLUGINS,
  payload: plugins
});
