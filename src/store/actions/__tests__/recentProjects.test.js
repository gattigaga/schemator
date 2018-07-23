import {
  SET_RECENT_PROJECTS,
  ADD_RECENT_PROJECT,
  setRecentProjects,
  addRecentProject
} from "../recentProjects";

describe("SET_RECENT_PROJECTS", () => {
  it("should return expected action", () => {
    const files = ["/file-1.json", "/file-2.json", "/file-3.json"];

    const expected = {
      type: SET_RECENT_PROJECTS,
      payload: files
    };

    const action = setRecentProjects(files);

    expect(action).toEqual(expected);
  });
});

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
