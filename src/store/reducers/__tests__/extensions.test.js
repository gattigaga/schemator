import { setExtensions } from "../../actions/extensions";
import extensions from "../extensions";

describe("extensions()", () => {
  it("should returns initial state", () => {
    const expected = [];
    const result = extensions(undefined, {});

    expect(result).toEqual(expected);
  });

  it("should set all extensions", () => {
    const myExtensions = [
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
    const expected = [...myExtensions];
    const action = setExtensions(myExtensions);
    const result = extensions(undefined, action);

    expect(result).toEqual(expected);
  });
});
