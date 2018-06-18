import { CLEAR_TABLES, clearTables } from "../../actions";

describe("CLEAR_TABLES", () => {
  it("should return expected action", () => {
    const expected = {
      type: CLEAR_TABLES
    };

    const action = clearTables();

    expect(action).toEqual(expected);
  });
});
