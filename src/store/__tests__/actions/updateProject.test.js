import { UPDATE_PROJECT, updateProject } from "../../actions";

describe("UPDATE_PROJECT", () => {
  it("should return expected action", () => {
    const project = {
      name: "My Project",
      timestamp: 1529420034779
    };

    const expected = {
      type: UPDATE_PROJECT,
      payload: project
    };

    const action = updateProject(project);

    expect(action).toEqual(expected);
  });
});
