import { createTable } from "../../extension";

describe("createTable()", () => {
  it("should returns new table object", () => {
    const expected = {
      id: expect.any(String),
      name: "User",
      timestamp: expect.any(Number),
      position: { x: 128, y: 128 },
      options: [{ id: "id", label: "ID", isChecked: true }]
    };

    const result = createTable("User", expected.options, expected.position);

    expect(result).toEqual(expected);
  });
});
