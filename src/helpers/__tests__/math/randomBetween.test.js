import { randomBetween } from "../../math";

describe("randomBetween()", () => {
  Math.random = jest.fn(() => 0.1);
  Math.floor = jest.fn(num => num);

  it("should returns random number", () => {
    const expected = 1.1;
    const result = randomBetween(0, 10);

    expect(result).toEqual(expected);
  });
});
