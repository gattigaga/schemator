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
    points = `
        M${fPosX + halfHeaderHeight} ${fPosY + inputY} 
        C${fPosX - curvePoint} ${fPosY + inputY} 
          ${tPosX + tableWidth + curvePoint} ${tPosY + halfHeaderHeight} 
          ${tPosX + tableWidth} ${tPosY + halfHeaderHeight}
      `;
  } else {
    points = `
        M${fPosX + tableWidth - halfHeaderHeight} ${fPosY + inputY} 
        C${fPosX + tableWidth + curvePoint} ${fPosY + inputY} 
          ${tPosX - curvePoint} ${tPosY + halfHeaderHeight} 
          ${tPosX + halfHeaderHeight} ${tPosY + halfHeaderHeight}
      `;
  }

  return points;
};
