export const SET_PAGE = "SET_PAGE";

/**
 * Get action to set active page.
 *
 * @param {string} pageID ID of destination page.
 * @returns {object} Action.
 */
export const setPage = pageID => ({
  type: SET_PAGE,
  payload: pageID
});
