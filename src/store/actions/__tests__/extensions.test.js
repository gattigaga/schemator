import { SET_EXTENSIONS, setExtensions } from "../extensions";

describe("SET_EXTENSIONS", () => {
  it("should return expected action", () => {
    const extensions = [
      {
        id: "1",
        name: "Laravel",
        author: "Gattigaga Hayyuta Dewa",
        description: "Work on Laravel scheme and export to model and migration",
        license: "MIT",
        version: "0.1.0",
        icon: "path/image.png"
      }
    ];

    const expected = {
      type: SET_EXTENSIONS,
      payload: extensions
    };

    const action = setExtensions(extensions);

    expect(action).toEqual(expected);
  });
});
