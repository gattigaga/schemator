import { getPathPoints } from "../../layout";

describe("getPathPoints()", () => {
  it("should returns path points (x1 <= x2)", () => {
    const coordinate = {
      x1: 32,
      y1: 32,
      x2: 320,
      y2: 320
    };

    const result = getPathPoints(coordinate);

    expect(result).toMatchSnapshot();
  });

  it("should returns path points (x1 > x2)", () => {
    const coordinate = {
      x1: 320,
      y1: 320,
      x2: 32,
      y2: 32
    };

    const result = getPathPoints(coordinate);

    expect(result).toMatchSnapshot();
  });
});
