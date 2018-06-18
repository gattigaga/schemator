import { REMOVE_TABLE, removeTable } from "../../actions";

describe("REMOVE_TABLE", () => {
  it("should return expected action", () => {
    const tableID = "1";

    const expected = {
      type: REMOVE_TABLE,
      payload: tableID
    };

    const action = removeTable(tableID);

    expect(action).toEqual(expected);
  });
});
