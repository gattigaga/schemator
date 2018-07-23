export const SET_RELATIONS = "SET_RELATIONS";
export const CLEAR_RELATIONS = "CLEAR_RELATIONS";
export const ADD_RELATION = "ADD_RELATION";
export const REMOVE_RELATION = "REMOVE_RELATION";
export const UPDATE_RELATION = "UPDATE_RELATION";

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

/**
 * Get action to add new relation
 *
 * @param {object} relation Relation data
 * @param {string} relation.id Relation ID
 * @param {string} relation.fieldID Foreign Key field ID
 * @param {string} relation.fromTableID Table ID which contains foreign key
 * @param {string} relation.toTableID Table ID as destination
 * @returns {object} Action
 */
export const addRelation = relation => ({
  type: ADD_RELATION,
  payload: relation
});

/**
 * Get action to remove existing relation
 *
 * @param {string} relationID Relation ID
 * @returns {object} Action
 */
export const removeRelation = relationID => ({
  type: REMOVE_RELATION,
  payload: relationID
});

/**
 * Get action to update existing relation
 *
 * @param {string} relationID Relation ID
 * @param {object} data New Data
 * @returns {object} Action
 */
export const updateRelation = (relationID, data) => ({
  type: UPDATE_RELATION,
  payload: {
    data,
    id: relationID
  }
});
