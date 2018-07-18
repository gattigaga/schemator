import { SET_RECENT_PROJECTS, setRecentProjects } from "../../actions";

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
