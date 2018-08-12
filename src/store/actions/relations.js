export const SET_RELATIONS = "SET_RELATIONS";
export const CLEAR_RELATIONS = "CLEAR_RELATIONS";
export const ADD_RELATION = "ADD_RELATION";
export const REMOVE_RELATION = "REMOVE_RELATION";
export const UPDATE_RELATION = "UPDATE_RELATION";

/**
 * Get action to set relation list.
 *
 * @param {object[]} relations Relation list.
 * @param {string} relations[].id ID of relation.
 * @param {string} relations[].fieldID ID of foreign key field.
 * @param {string} relations[].fromTableID ID of table which contains foreign key.
 * @param {string} relations[].toTableID ID of destination table.
 * @returns {object} Action.
 */
export const setRelations = relations => ({
  type: SET_RELATIONS,
  payload: relations
});

/**
 * Get action to clear all relations.
 *
 * @returns {object} Action.
 */
export const clearRelations = () => ({
  type: CLEAR_RELATIONS
});

/**
 * Get action to add new relation.
 *
 * @param {object} relation New relation.
 * @param {string} relation.id ID of relation.
 * @param {string} relation.fieldID ID of foreign key field.
 * @param {string} relation.fromTableID ID of table which contains foreign key.
 * @param {string} relation.toTableID ID of destination table.
 * @returns {object} Action.
 */
export const addRelation = relation => ({
  type: ADD_RELATION,
  payload: relation
});

/**
 * Get action to remove an existing relation.
 *
 * @param {string} relationID ID of relation should be removed.
 * @returns {object} Action.
 */
export const removeRelation = relationID => ({
  type: REMOVE_RELATION,
  payload: relationID
});

/**
 * Get action to update an existing relation.
 *
 * @param {string} relationID ID of relation should be updated.
 * @param {object} data New Data.
 * @returns {object} Action.
 */
export const updateRelation = (relationID, data) => ({
  type: UPDATE_RELATION,
  payload: {
    data,
    id: relationID
  }
});
