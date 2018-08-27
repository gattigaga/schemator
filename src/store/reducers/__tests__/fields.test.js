import {
  setFields,
  clearFields,
  addField,
  removeField,
  updateField
} from "../../actions/fields";
import fields from "../fields";

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
      },
      {
        id: "2",
        tableID: "1",
        name: "name",
        type: "STRING"
      }
    ];

    const data = {
      name: "user_id"
    };

    const expected = [
      {
        ...initial[0],
        ...data
      },
      initial[1]
    ];

    const action = updateField("1", data);
    const result = fields(initial, action);

    expect(result).toEqual(expected);
  });
});
