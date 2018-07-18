import { setRecentProjects } from "../../actions";
import { recentProjects } from "../../reducers";

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
});
