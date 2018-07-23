export const SET_FIELDS = "SET_FIELDS";
export const CLEAR_FIELDS = "CLEAR_FIELDS";
export const ADD_FIELD = "ADD_FIELD";
export const REMOVE_FIELD = "REMOVE_FIELD";
export const UPDATE_FIELD = "UPDATE_FIELD";

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
