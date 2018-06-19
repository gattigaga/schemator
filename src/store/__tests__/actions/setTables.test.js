import { SET_TABLES, setTables } from "../../actions";

describe("SET_TABLES", () => {
  it("should return expected action", () => {
    const tables = [
      {
        id: "1",
        name: "User",
        timestamp: 1529420034779,
        position: {
          x: 0,
          y: 0
        }
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
