export const SET_PROJECT = "SET_PROJECT";
export const UPDATE_PROJECT = "UPDATE_PROJECT";
export const CLEAR_PROJECT = "CLEAR_PROJECT";

/**
 * Get action to set project.
 *
 * @param {object} project Project meta data.
 * @param {string} project.name Project name.
 * @param {number} project.timestamp Project date creation timestamp.
 * @param {number} project.zoom WorkArea zoom percentage.
 * @returns {object} Action.
 */
export const setProject = project => ({
  type: SET_PROJECT,
  payload: project
});

/**
 * Get action to update project.
 *
 * @param {object} project Project meta data.
 * @param {string} project.name Project name.
 * @param {number} project.timestamp Project date creation timestamp.
 * @param {number} project.zoom WorkArea zoom percentage.
 * @returns {object} Action.
 */
export const updateProject = project => ({
  type: UPDATE_PROJECT,
  payload: project
});

/**
 * Get action to clear a project.
 *
 * @returns {object} Action.
 */
export const clearProject = () => ({
  type: CLEAR_PROJECT
});
