import { SET_PROJECT, setProject } from "../../actions";

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
