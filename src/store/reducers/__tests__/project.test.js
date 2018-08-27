import { setProject, updateProject, clearProject } from "../../actions/project";
import project from "../project";

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

  it("should update project", () => {
    const initial = {
      name: "Initial Project",
      timestamp: 1529420034779,
      zoom: 100
    };

    const data = {
      name: "My Project"
    };

    const expected = {
      ...initial,
      ...data
    };

    const action = updateProject(data);
    const result = project(initial, action);

    expect(result).toEqual(expected);
  });

  it("should clear project", () => {
    const expected = null;
    const action = clearProject();
    const result = project(undefined, action);

    expect(result).toEqual(expected);
  });
});
