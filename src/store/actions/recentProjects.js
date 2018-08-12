export const SET_RECENT_PROJECTS = "SET_RECENT_PROJECTS";
export const ADD_RECENT_PROJECT = "ADD_RECENT_PROJECT";

/**
 * Get action to set recent opened projects.
 *
 * @param {string[]} recents File path lists.
 * @returns {object} Action.
 */
export const setRecentProjects = recents => ({
  type: SET_RECENT_PROJECTS,
  payload: recents
});

/**
 * Get action to add new opened project path.
 *
 * @param {string} recent File path.
 * @returns {object} Action.
 */
export const addRecentProject = recent => ({
  type: ADD_RECENT_PROJECT,
  payload: recent
});
