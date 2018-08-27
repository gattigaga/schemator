import {
  SET_PROJECT,
  UPDATE_PROJECT,
  CLEAR_PROJECT,
  setProject,
  updateProject,
  clearProject
} from "../project";

describe("SET_PROJECT", () => {
  it("should return expected action", () => {
    const project = {
      name: "My Project",
      timestamp: 1529420034779
    };

    const expected = {
      type: SET_PROJECT,
      payload: project
    };

    const action = setProject(project);

    expect(action).toEqual(expected);
  });
});

describe("UPDATE_PROJECT", () => {
  it("should return expected action", () => {
    const project = {
      name: "My Project",
      timestamp: 1529420034779,
      zoom: 75
    };

    const expected = {
      type: UPDATE_PROJECT,
      payload: project
    };

    const action = updateProject(project);

    expect(action).toEqual(expected);
  });
});

describe("CLEAR_PROJECT", () => {
  it("should return expected action", () => {
    const expected = {
      type: CLEAR_PROJECT
    };

    const action = clearProject();

    expect(action).toEqual(expected);
  });
});
