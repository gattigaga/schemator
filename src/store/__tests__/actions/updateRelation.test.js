import { UPDATE_RELATION, updateRelation } from "../../actions";

describe("UPDATE_RELATION", () => {
  it("should return expected action", () => {
    const relationID = "1";
    const data = {
      name: "user_id"
    };

    const expected = {
      type: UPDATE_RELATION,
      payload: {
        data,
        id: relationID
      }
    };

    const action = updateRelation(relationID, data);

    expect(action).toEqual(expected);
  });
});
