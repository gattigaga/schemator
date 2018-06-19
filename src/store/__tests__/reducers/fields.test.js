import {
  setFields,
  clearFields,
  addField,
  removeField,
  updateField
} from "../../actions";
import { fields } from "../../reducers";

describe("fields()", () => {
  it("should returns initial state", () => {
    const expected = [];
    const result = fields(undefined, {});

    expect(result).toEqual(expected);
  });

  it("should set all fields", () => {
    const myFields = [
      {
        id: "1",
        tableID: "1",
        name: "id",
        type: "INCREMENT"
      }
    ];
    const expected = [...myFields];
    const action = setFields(myFields);
    const result = fields(undefined, action);

    expect(result).toEqual(expected);
  });

  it("should clear all fields", () => {
    const initial = [
      {
        id: "1",
        tableID: "1",
        name: "id",
        type: "INCREMENT"
      }
    ];
    const expected = [];
    const action = clearFields();
    const result = fields(initial, action);

    expect(result).toEqual(expected);
  });

  it("should add new field", () => {
    const field = {
      id: "1",
      tableID: "1",
      name: "id",
      type: "INCREMENT"
    };

    const expected = [field];
    const action = addField(field);
    const result = fields(undefined, action);

    expect(result).toEqual(expected);
  });

  it("should remove existing field", () => {
    const initial = [
      {
        id: "1",
        tableID: "1",
        name: "id",
        type: "INCREMENT"
      }
    ];

    const expected = [];
    const action = removeField("1");
    const result = fields(initial, action);

    expect(result).toEqual(expected);
  });

  it("should update existing field", () => {
    const initial = [
      {
        id: "1",
        tableID: "1",
        name: "id",
        type: "INCREMENT"
      }
    ];

    const data = {
      name: "user_id"
    };

    const expected = [
      {
        ...initial[0],
        ...data
      }
    ];

    const action = updateField("1", data);
    const result = fields(initial, action);

    expect(result).toEqual(expected);
  });
});
