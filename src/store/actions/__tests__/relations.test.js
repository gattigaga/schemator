import {
  ADD_RELATION,
  REMOVE_RELATION,
  UPDATE_RELATION,
  CLEAR_RELATIONS,
  SET_RELATIONS,
  addRelation,
  removeRelation,
  updateRelation,
  clearRelations,
  setRelations
} from "../relations";

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

describe("CLEAR_RELATIONS", () => {
  it("should return expected action", () => {
    const expected = {
      type: CLEAR_RELATIONS
    };

    const action = clearRelations();

    expect(action).toEqual(expected);
  });
});

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