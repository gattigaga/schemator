import { CLEAR_RELATIONS, clearRelations } from "../../actions";

describe("CLEAR_RELATIONS", () => {
  it("should return expected action", () => {
    const expected = {
      type: CLEAR_RELATIONS
    };

    const action = clearRelations();

    expect(action).toEqual(expected);
  });
});
