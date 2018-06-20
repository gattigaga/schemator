import { REMOVE_RELATION, removeRelation } from "../../actions";

describe("REMOVE_RELATION", () => {
  it("should return expected action", () => {
    const relationID = "1";

    const expected = {
      type: REMOVE_RELATION,
      payload: relationID
    };

    const action = removeRelation(relationID);

    expect(action).toEqual(expected);
  });
});
