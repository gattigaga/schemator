import {
  setRelations,
  clearRelations,
  addRelation,
  removeRelation,
  updateRelation
} from "../../actions/relations";
import relations from "../relations";

describe("relations()", () => {
  it("should returns initial state", () => {
    const expected = [];
    const result = relations(undefined, {});

    expect(result).toEqual(expected);
  });

  it("should set all relations", () => {
    const myRelations = [
      {
        id: "1",
        fieldID: "2",
        fromTableID: "2",
        toTableID: "1"
      }
    ];
    const expected = [...myRelations];
    const action = setRelations(myRelations);
    const result = relations(undefined, action);

    expect(result).toEqual(expected);
  });

  it("should clear all relations", () => {
    const initial = [
      {
        id: "1",
        fieldID: "2",
        fromTableID: "2",
        toTableID: "1"
      }
    ];
    const expected = [];
    const action = clearRelations();
    const result = relations(initial, action);

    expect(result).toEqual(expected);
  });

  it("should add new relation", () => {
    const relation = {
      id: "1",
      fieldID: "2",
      fromTableID: "2",
      toTableID: "1"
    };

    const expected = [relation];
    const action = addRelation(relation);
    const result = relations(undefined, action);

    expect(result).toEqual(expected);
  });

  it("should remove existing relation", () => {
    const initial = [
      {
        id: "1",
        fieldID: "2",
        fromTableID: "2",
        toTableID: "1"
      }
    ];

    const expected = [];
    const action = removeRelation("1");
    const result = relations(initial, action);

    expect(result).toEqual(expected);
  });

  it("should update existing relation", () => {
    const initial = [
      {
        id: "1",
        fieldID: "2",
        fromTableID: "2",
        toTableID: "1"
      },
      {
        id: "2",
        fieldID: "3",
        fromTableID: "3",
        toTableID: "2"
      }
    ];

    const data = {
      name: "user_id"
    };

    const expected = [
      {
        ...initial[0],
        ...data
      },
      initial[1]
    ];

    const action = updateRelation("1", data);
    const result = relations(initial, action);

    expect(result).toEqual(expected);
  });
});
