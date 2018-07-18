import { ADD_RECENT_PROJECT, addRecentProject } from "../../actions";

describe("ADD_RECENT_PROJECT", () => {
  it("should return expected action", () => {
    const file = "/file-1.json";

    const expected = {
      type: ADD_RECENT_PROJECT,
      payload: file
    };

    const action = addRecentProject(file);

    expect(action).toEqual(expected);
  });
});
