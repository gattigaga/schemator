export const SET_FIELDS = "SET_FIELDS";
export const CLEAR_FIELDS = "CLEAR_FIELDS";
export const ADD_FIELD = "ADD_FIELD";
export const REMOVE_FIELD = "REMOVE_FIELD";
export const UPDATE_FIELD = "UPDATE_FIELD";

/**
 * Get action to set field list.
 *
 * @param {object[]} fields Field list.
 * @param {string} fields[].id
 * @param {string} fields[].tableID
 * @param {string} fields[].name
 * @param {string} fields[].type
 * @returns {object} Action.
 */
export const setFields = fields => ({
  type: SET_FIELDS,
  payload: fields
});

/**
 * Get action to clear all fields.
 *
 * @returns {object} Action.
 */
export const clearFields = () => ({
  type: CLEAR_FIELDS
});

/**
 * Get action to add new field.
 *
 * @param {object} field New field.
 * @param {string} field.id
 * @param {string} field.tableID
 * @param {string} field.name
 * @param {string} field.type
 * @returns {object} Action.
 */
export const addField = field => ({
  type: ADD_FIELD,
  payload: field
});

/**
 * Get action to remove an existing field.
 *
 * @param {string} fieldID ID of field which should be removed.
 * @returns {object} Action.
 */
export const removeField = fieldID => ({
  type: REMOVE_FIELD,
  payload: fieldID
});

/**
 * Get action to update an existing field.
 *
 * @param {string} fieldID ID of field which should be updated.
 * @param {object} data New data.
 * @returns {object} Action.
 */
export const updateField = (fieldID, data) => ({
  type: UPDATE_FIELD,
  payload: {
    data,
    id: fieldID
  }
});
