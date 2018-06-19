import { REMOVE_FIELD, removeField } from "../../actions";

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
