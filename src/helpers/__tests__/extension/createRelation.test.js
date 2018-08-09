import { createRelation } from "../../extension";

describe("createRelation()", () => {
  it("should returns new relation object", () => {
    const expected = {
      id: expect.any(String),
      fieldID: "1",
      fromTableID: "2",
      toTableID: "1"
    };

    const result = createRelation("1", "2", "1");

    expect(result).toEqual(expected);
  });
});
