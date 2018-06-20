export const SET_TABLES = "SET_TABLES";
export const CLEAR_TABLES = "CLEAR_TABLES";
export const ADD_TABLE = "ADD_TABLE";
export const REMOVE_TABLE = "REMOVE_TABLE";
export const UPDATE_TABLE = "UPDATE_TABLE";

export const SET_FIELDS = "SET_FIELDS";
export const CLEAR_FIELDS = "CLEAR_FIELDS";
export const ADD_FIELD = "ADD_FIELD";
export const REMOVE_FIELD = "REMOVE_FIELD";
export const UPDATE_FIELD = "UPDATE_FIELD";

export const SET_RELATIONS = "SET_RELATIONS";
export const CLEAR_RELATIONS = "CLEAR_RELATIONS";

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

/**
 * Get action to set fields
 *
 * @param {object[]} fields Field list
 * @param {string} fields[].id Field ID
 * @param {string} fields[].tableID Table ID
 * @param {string} fields[].name Field name
 * @param {string} fields[].type Field type
 * @returns {object} Action
 */
export const setFields = fields => ({
  type: SET_FIELDS,
  payload: fields
});

/**
 * Get action to clear all fields
 *
 * @returns {object} Action
 */
export const clearFields = () => ({
  type: CLEAR_FIELDS
});

/**
 * Get action to add new field
 *
 * @param {object} field Field data
 * @param {string} field.id Field ID
 * @param {string} field.tableID Table ID
 * @param {string} field.name Field name
 * @param {string} field.type Field type
 * @returns {object} Action
 */
export const addField = field => ({
  type: ADD_FIELD,
  payload: field
});

/**
 * Get action to remove existing field
 *
 * @param {string} fieldID Field ID
 * @returns {object} Action
 */
export const removeField = fieldID => ({
  type: REMOVE_FIELD,
  payload: fieldID
});

/**
 * Get action to update existing field
 *
 * @param {string} fieldID Field ID
 * @param {object} data New Data
 * @returns {object} Action
 */
export const updateField = (fieldID, data) => ({
  type: UPDATE_FIELD,
  payload: {
    data,
    id: fieldID
  }
});

/**
 * Get action to set relations
 *
 * @param {object[]} relations Relation list
 * @param {string} relations[].id Relation ID
 * @param {string} relations[].fieldID Foreign Key field ID
 * @param {string} relations[].fromTableID Table ID which contains foreign key
 * @param {string} relations[].toTableID Table ID as destination
 * @returns {object} Action
 */
export const setRelations = relations => ({
  type: SET_RELATIONS,
  payload: relations
});

/**
 * Get action to clear all relations
 *
 * @returns {object} Action
 */
export const clearRelations = () => ({
  type: CLEAR_RELATIONS
});
