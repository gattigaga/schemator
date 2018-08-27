/**
 * Get relation line path points (for SVG d attribute).
 *
 * @param {object} coordinate Line coordinate.
 * @param {number} coordinate.x1
 * @param {number} coordinate.y1
 * @param {number} coordinate.x2
 * @param {number} coordinate.y2
 * @returns {string} Path points.
 */
export const getPathPoints = coordinate => {
  const { x1, y1, x2, y2 } = coordinate;
  const curvePoint = x1 <= x2 ? +64 : -64;
  const m = [x1, y1].join(" ");
  const c = [x1 + curvePoint, y1, x2 - curvePoint, y2, x2, y2].join(" ");
  const points = `M${m} C${c}`;

  return points.replace("\n", "");
};
