import { UPDATE_TABLE, updateTable } from "../../actions";

describe("UPDATE_TABLE", () => {
  it("should return expected action", () => {
    const tableID = "1";
    const data = {
      name: "Comment"
    };

    const expected = {
      type: UPDATE_TABLE,
      payload: {
        data,
        id: tableID
      }
    };

    const action = updateTable(tableID, data);

    expect(action).toEqual(expected);
  });
});
