export const SET_TABLES = "SET_TABLES";
export const CLEAR_TABLES = "CLEAR_TABLES";
export const ADD_TABLE = "ADD_TABLE";
export const REMOVE_TABLE = "REMOVE_TABLE";
export const UPDATE_TABLE = "UPDATE_TABLE";

/**
 * Get action to set tables
 *
 * @param {object[]} tables Specified tables
 * @param {string} tables[].id Table ID
 * @param {string} tables[].name Table name
 * @param {number} tables[].timestamp Table creation date timestamp
 * @param {object} tables[].position Table position
 * @param {number} tables[].position.x Position X
 * @param {number} tables[].position.y Position Y
 * @returns {object} Action
 */
export const setTables = tables => ({
  type: SET_TABLES,
  payload: tables
});

/**
 * Get action to add new table
 *
 * @param {object} table Specified table
 * @param {string} table.id Table ID
 * @param {string} table.name Table name
 * @param {number} table.timestamp Table creation date timestamp
 * @param {object} table.position Table position
 * @param {number} table.position.x Position X
 * @param {number} table.position.y Position Y
 * @returns {object} Action
 */
export const addTable = table => ({
  type: ADD_TABLE,
  payload: table
});

/**
 * Get action to remove existing table
 *
 * @param {string} tableID Table ID
 * @returns {object} Action
 */
export const removeTable = tableID => ({
  type: REMOVE_TABLE,
  payload: tableID
});

/**
 * Get action to update existing table
 *
 * @param {string} tableID Table ID
 * @param {object} data New Data
 * @returns {object} Action
 */
export const updateTable = (tableID, data) => ({
  type: UPDATE_TABLE,
  payload: {
    data,
    id: tableID
  }
});

/**
 * Get action to clear all tables
 *
 * @returns {object} Action
 */
export const clearTables = () => ({
  type: CLEAR_TABLES
});
