import uuid from "uuid/v4";

/**
 * Create a new table.
 *
 * @param {string} name
 * @param {object[]} options
 * @param {object} position
 * @param {number} position.x
 * @param {number} position.y
 */
export const createTable = (name, options, position) => ({
  id: uuid(),
  name,
  timestamp: Date.now(),
  position,
  options
});

/**
 * Create new field.
 *
 * @param {string} tableID ID from table which contains this field
 * @param {string} name
 * @param {string} type
 */
export const createField = (tableID, name, type) => ({
  id: uuid(),
  tableID,
  name,
  type
});

/**
 * Create new table option checkbox.
 *
 * @param {string} id Camel cased Label as ID (i.e. rememberToken)
 * @param {string} label Label which shown in table
 * @param {boolean} [isChecked=false] Is option checked or not
 */
export const createOption = (id, label, isChecked = false) => ({
  id,
  label,
  isChecked
});

/**
 * Create new relation.
 *
 * @param {string} fieldID Camel cased Label as ID (i.e. rememberToken)
 * @param {string} fromTableID ID of table which contains foreign key
 * @param {string} toTableID ID of table destination
 */
export const createRelation = (fieldID, fromTableID, toTableID) => ({
  id: uuid(),
  fieldID,
  fromTableID,
  toTableID
});
