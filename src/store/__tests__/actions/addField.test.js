import { ADD_FIELD, addField } from "../../actions";

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
