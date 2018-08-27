import {
  setRecentProjects,
  addRecentProject
} from "../../actions/recentProjects";
import recentProjects from "../recentProjects";

describe("recentProjects()", () => {
  it("should returns initial state", () => {
    const expected = [];
    const result = recentProjects(undefined, {});

    expect(result).toEqual(expected);
  });

  it("should set recent projects", () => {
    const expected = ["/file-1.json", "/file-2.json", "/file-3.json"];
    const action = setRecentProjects(expected);
    const result = recentProjects(undefined, action);

    expect(result).toEqual(expected);
  });

  it("should add new recent project", () => {
    const initial = ["/file-1.json"];
    const newRecent = "/file-2.json";
    const expected = [newRecent, ...initial];
    const action = addRecentProject(newRecent);
    const result = recentProjects(initial, action);

    expect(result).toEqual(expected);
  });
});
