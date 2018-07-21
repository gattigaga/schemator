import { getPathPoints } from "../../layout";

describe("getPathPoints()", () => {
  it("should returns path points (foreign key in right table)", () => {
    const fromPosition = { x: 320, y: 32 };
    const toPosition = { x: 32, y: 32 };
    const fieldIndex = 0;
    const result = getPathPoints(fromPosition, toPosition, fieldIndex);

    expect(result).toMatchSnapshot();
  });

  it("should returns path points (foreign key in left table)", () => {
    const fromPosition = { x: 32, y: 32 };
    const toPosition = { x: 320, y: 32 };
    const fieldIndex = 0;
    const result = getPathPoints(fromPosition, toPosition, fieldIndex);

    expect(result).toMatchSnapshot();
  });
});
