import { SET_RELATIONS, setRelations } from "../../actions";

describe("SET_RELATIONS", () => {
  it("should return expected action", () => {
    const relations = [
      {
        id: "1",
        fieldID: "2",
        fromTableID: "2",
        toTableID: "1"
      }
    ];

    const expected = {
      type: SET_RELATIONS,
      payload: relations
    };

    const action = setRelations(relations);

    expect(action).toEqual(expected);
  });
});
