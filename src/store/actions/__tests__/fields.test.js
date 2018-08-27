import {
  ADD_FIELD,
  UPDATE_FIELD,
  SET_FIELDS,
  REMOVE_FIELD,
  CLEAR_FIELDS,
  addField,
  updateField,
  setFields,
  removeField,
  clearFields
} from "../fields";

describe("ADD_FIELD", () => {
  it("should return expected action", () => {
    const field = {
      id: "1",
      tableID: "1",
      name: "id",
      type: "INCREMENT"
    };

    const expected = {
      type: ADD_FIELD,
      payload: field
    };

    const action = addField(field);

    expect(action).toEqual(expected);
  });
});

describe("UPDATE_FIELD", () => {
  it("should return expected action", () => {
    const fieldID = "1";
    const data = {
      name: "user_id"
    };

    const expected = {
      type: UPDATE_FIELD,
      payload: {
        data,
        id: fieldID
      }
    };

    const action = updateField(fieldID, data);

    expect(action).toEqual(expected);
  });
});

describe("SET_FIELDS", () => {
  it("should return expected action", () => {
    const fields = [
      {
        id: "1",
        tableID: "1",
        name: "id",
        type: "INCREMENT"
      }
    ];

    const expected = {
      type: SET_FIELDS,
      payload: fields
    };

    const action = setFields(fields);

    expect(action).toEqual(expected);
  });
});

describe("REMOVE_FIELD", () => {
  it("should return expected action", () => {
    const fieldID = "1";

    const expected = {
      type: REMOVE_FIELD,
      payload: fieldID
    };

    const action = removeField(fieldID);

    expect(action).toEqual(expected);
  });
});

describe("CLEAR_FIELDS", () => {
  it("should return expected action", () => {
    const expected = {
      type: CLEAR_FIELDS
    };

    const action = clearFields();

    expect(action).toEqual(expected);
  });
});
