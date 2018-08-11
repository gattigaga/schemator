import { convertType } from "../../helpers";

describe("convertType()", () => {
  it("should returns converted type", () => {
    const expected = "dateTimeTz";
    const result = convertType("DATE_TIME_TZ");

    expect(result).toEqual(expected);
  });
});
