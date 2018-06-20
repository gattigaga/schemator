import { ADD_RELATION, addRelation } from "../../actions";

describe("ADD_RELATION", () => {
  it("should return expected action", () => {
    const relation = {
      id: "1",
      fieldID: "2",
      fromTableID: "2",
      toTableID: "1"
    };

    const expected = {
      type: ADD_RELATION,
      payload: relation
    };

    const action = addRelation(relation);

    expect(action).toEqual(expected);
  });
});
