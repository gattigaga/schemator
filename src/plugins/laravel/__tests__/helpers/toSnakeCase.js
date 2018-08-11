import { toSnakeCase } from "../../helpers";

describe("toSnakeCase()", () => {
  it("should returns string in snake case", () => {
    const expected = "my_mac_book";
    const result = toSnakeCase("MyMacBook");

    expect(result).toEqual(expected);
  });
});
