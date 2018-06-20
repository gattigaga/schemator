import { capitalize } from "../../formatter";

describe("capitalize()", () => {
  it("should returns string in capital", () => {
    const expected = "MacBook";
    const result = capitalize("macBook");

    expect(result).toEqual(expected);
  });
});
