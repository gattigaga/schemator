export const SET_TABLES = "SET_TABLES";

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
 * @param {object[]} tables[].fields Table field list
 * @param {string} tables[].fields[].id Field ID
 * @param {string} tables[].fields[].name Field name
 * @param {string} tables[].fields[].type Field type
 * @returns {object} Action
 */
export const setTables = tables => ({
  type: SET_TABLES,
  payload: tables
});
