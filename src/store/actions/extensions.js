export const SET_EXTENSIONS = "SET_EXTENSIONS";

/**
 * Get action to set extension list.
 *
 * @param {object[]} extensions Extension list.
 * @param {string} extensions[].id
 * @param {string} extensions[].name
 * @param {string} extensions[].author
 * @param {string} extensions[].description
 * @param {string} extensions[].license
 * @param {string} extensions[].version
 * @param {string} extensions[].icon
 * @returns {object} Action.
 */
export const setExtensions = extensions => ({
  type: SET_EXTENSIONS,
  payload: extensions
});
