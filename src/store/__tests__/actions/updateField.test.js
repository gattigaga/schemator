import { UPDATE_FIELD, updateField } from "../../actions";

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
