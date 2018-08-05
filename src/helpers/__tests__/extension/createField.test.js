import { createField } from "../../extension";

describe("createField()", () => {
  it("should returns new field object", () => {
    const expected = {
      id: expect.any(String),
      tableID: "id-1",
      name: "field",
      type: "STRING"
    };

    const result = createField("id-1", "field", "STRING");

    expect(result).toEqual(expected);
  });
});
