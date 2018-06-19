import { SET_FIELDS, setFields } from "../../actions";

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
