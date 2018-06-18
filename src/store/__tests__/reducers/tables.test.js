import {
  setTables,
  clearTables,
  addTable,
  removeTable,
  updateTable
} from "../../actions";
import { tables } from "../../reducers";

describe("tables()", () => {
  it("should returns initial state", () => {
    const expected = [];
    const result = tables(undefined, {});

    expect(result).toEqual(expected);
  });

  it("should set all tables", () => {
    const myTables = [
      {
        id: "1",
        name: "User",
        field: []
      }
    ];
    const expected = [...myTables];
    const action = setTables(myTables);
    const result = tables(undefined, action);

    expect(result).toEqual(expected);
  });

  it("should clear all tables", () => {
    const initial = [
      {
        id: "1",
        name: "User",
        field: []
      }
    ];
    const expected = [];
    const action = clearTables();
    const result = tables(initial, action);

    expect(result).toEqual(expected);
  });

  it("should add new table", () => {
    const table = {
      id: "1",
      name: "User",
      field: []
    };

    const expected = [table];
    const action = addTable(table);
    const result = tables(undefined, action);

    expect(result).toEqual(expected);
  });

  it("should remove existing table", () => {
    const initial = [
      {
        id: "1",
        name: "User",
        field: []
      }
    ];

    const expected = [];
    const action = removeTable("1");
    const result = tables(initial, action);

    expect(result).toEqual(expected);
  });

  it("should update existing table", () => {
    const initial = [
      {
        id: "1",
        name: "User",
        field: []
      }
    ];

    const data = {
      name: "Comment"
    };

    const expected = [
      {
        ...initial[0],
        ...data
      }
    ];

    const action = updateTable("1", data);
    const result = tables(initial, action);

    expect(result).toEqual(expected);
  });
});
