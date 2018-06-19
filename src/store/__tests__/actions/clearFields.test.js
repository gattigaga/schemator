import { CLEAR_FIELDS, clearFields } from "../../actions";

describe("CLEAR_FIELDS", () => {
  it("should return expected action", () => {
    const expected = {
      type: CLEAR_FIELDS
    };

    const action = clearFields();

    expect(action).toEqual(expected);
  });
});
