import {
  ADD_TABLE,
  CLEAR_TABLES,
  REMOVE_TABLE,
  UPDATE_TABLE,
  SET_TABLES,
  addTable,
  clearTables,
  removeTable,
  updateTable,
  setTables
} from "../tables";

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

describe("CLEAR_TABLES", () => {
  it("should return expected action", () => {
    const expected = {
      type: CLEAR_TABLES
    };

    const action = clearTables();

    expect(action).toEqual(expected);
  });
});

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
