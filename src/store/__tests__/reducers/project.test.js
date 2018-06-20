import { setProject } from "../../actions";
import { project } from "../../reducers";

describe("project()", () => {
  it("should returns initial state", () => {
    const expected = null;
    const result = project(undefined, {});

    expect(result).toEqual(expected);
  });

  it("should set project", () => {
    const myProject = {
      name: "My Project",
      timestamp: 1529420034779
    };
    const expected = myProject;
    const action = setProject(myProject);
    const result = project(undefined, action);

    expect(result).toEqual(expected);
  });
});
