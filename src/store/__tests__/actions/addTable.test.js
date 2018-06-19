import { ADD_TABLE, addTable } from "../../actions";

describe("ADD_TABLE", () => {
  it("should return expected action", () => {
    const table = {
      id: "1",
      name: "User",
      timestamp: 1529420034779,
      position: {
        x: 0,
        y: 0
      }
    };

    const expected = {
      type: ADD_TABLE,
      payload: table
    };

    const action = addTable(table);

    expect(action).toEqual(expected);
  });
});
