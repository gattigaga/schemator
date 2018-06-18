import { SET_TABLES, setTables } from "../../actions";

describe("SET_TABLES", () => {
  it("should return expected action", () => {
    const tables = [
      {
        id: "1",
        name: "User",
        fields: [
          {
            id: "1",
            name: "id",
            type: "INCREMENT"
          }
        ]
      }
    ];

    const expected = {
      type: SET_TABLES,
      payload: tables
    };

    const action = setTables(tables);

    expect(action).toEqual(expected);
  });
});
