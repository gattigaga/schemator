import { ADD_TABLE, addTable } from "../../actions";

describe("ADD_TABLE", () => {
  it("should return expected action", () => {
    const table = {
      id: "1",
      name: "User",
      fields: [
        {
          id: "1",
          name: "id",
          type: "INCREMENT"
        }
      ]
    };

    const expected = {
      type: ADD_TABLE,
      payload: table
    };

    const action = addTable(table);

    expect(action).toEqual(expected);
  });
});
