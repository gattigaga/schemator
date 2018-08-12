export const SET_TABLES = "SET_TABLES";
export const CLEAR_TABLES = "CLEAR_TABLES";
export const ADD_TABLE = "ADD_TABLE";
export const REMOVE_TABLE = "REMOVE_TABLE";
export const UPDATE_TABLE = "UPDATE_TABLE";

/**
 * Get action to set table list.
 *
 * @param {object[]} tables Table list.
 * @param {string} tables[].id ID of table.
 * @param {string} tables[].name Name of table.
 * @param {number} tables[].timestamp Table creation date timestamp.
 * @param {object} tables[].position Table position in WorkArea.
 * @param {number} tables[].position.x
 * @param {number} tables[].position.y
 * @returns {object} Action.
 */
export const setTables = tables => ({
  type: SET_TABLES,
  payload: tables
});

/**
 * Get action to add new table.
 *
 * @param {object} table New table.
 * @param {string} table.id ID of table.
 * @param {string} table.name Name of table.
 * @param {number} table.timestamp Table creation date timestamp.
 * @param {object} table.position Table position in WorkArea.
 * @param {number} table.position.x
 * @param {number} table.position.y
 * @returns {object} Action
 */
export const addTable = table => ({
  type: ADD_TABLE,
  payload: table
});

/**
 * Get action to remove an existing table.
 *
 * @param {string} tableID ID of table should be removed.
 * @returns {object} Action.
 */
export const removeTable = tableID => ({
  type: REMOVE_TABLE,
  payload: tableID
});

/**
 * Get action to update an existing table.
 *
 * @param {string} tableID ID of table should be updated.
 * @param {object} data New Data.
 * @returns {object} Action.
 */
export const updateTable = (tableID, data) => ({
  type: UPDATE_TABLE,
  payload: {
    data,
    id: tableID
  }
});

/**
 * Get action to clear all tables.
 *
 * @returns {object} Action.
 */
export const clearTables = () => ({
  type: CLEAR_TABLES
});
