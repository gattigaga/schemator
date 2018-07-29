import { createRef } from "react";
import uuid from "uuid/v4";

import { updateProject } from "../store/actions/project";
import { addTable } from "../store/actions/tables";
import { addField } from "../store/actions/fields";
import store from "../store/store";

/**
 * Get relation line path points (for SVG d attribute)
 *
 * @param {object} fromTablePosition Position of table which has foreign key
 * @param {number} fromTablePosition.x Position X
 * @param {number} fromTablePosition.y Position Y
 * @param {object} toTablePosition Position of destination table
 * @param {number} toTablePosition.x Position X
 * @param {number} toTablePosition.y Position Y
 * @param {number} fieldIndex Index of foreign key field relative from it's table
 * @returns {string} Path points
 */
export const getPathPoints = (
  fromTablePosition,
  toTablePosition,
  fieldIndex
) => {
  const { x: fPosX, y: fPosY } = fromTablePosition;
  const { x: tPosX, y: tPosY } = toTablePosition;
  const headerHeight = 36;
  const inputHeight = 38;
  const tableWidth = 240;
  const curvePoint = 64;
  const halfHeaderHeight = headerHeight / 2;
  const inputY = headerHeight + fieldIndex * inputHeight + inputHeight / 2;
  const isFromTableInRight = fPosX > tPosX;
  let points = "";

  if (isFromTableInRight) {
    const m = [fPosX + halfHeaderHeight, fPosY + inputY].join(" ");
    const c = [
      fPosX - curvePoint,
      fPosY + inputY,
      tPosX + tableWidth + curvePoint,
      tPosY + halfHeaderHeight,
      tPosX + tableWidth,
      tPosY + halfHeaderHeight
    ].join(" ");

    points = `M${m} C${c}`;
  } else {
    const m = [fPosX + tableWidth - halfHeaderHeight, fPosY + inputY].join(" ");
    const c = [
      fPosX + tableWidth + curvePoint,
      fPosY + inputY,
      tPosX - curvePoint,
      tPosY + halfHeaderHeight,
      tPosX + halfHeaderHeight,
      tPosY + halfHeaderHeight
    ].join(" ");

    points = `M${m} C${c}`;
  }

  return points.replace("\n", "");
};

/**
 * Create new table
 *
 * @param {object} position Table position
 * @param {number} position.x
 * @param {number} position.y
 */
export const createTable = position => {
  const project = {
    isModified: true
  };

  const newTable = {
    id: uuid(),
    ref: createRef(),
    name: "NewTable",
    timestamp: Date.now(),
    position,
    options: {
      id: true,
      rememberToken: false,
      softDeletes: false,
      timestamps: true
    }
  };

  const newField = {
    id: uuid(),
    tableID: newTable.id,
    name: "field",
    type: "INTEGER"
  };

  store.dispatch(updateProject(project));
  store.dispatch(addTable(newTable));
  store.dispatch(addField(newField));
};
