import { setPlugins } from "../../actions/plugins";
import plugins from "../plugins";

describe("plugins()", () => {
  it("should returns initial state", () => {
    const expected = [];
    const result = plugins(undefined, {});

    expect(result).toEqual(expected);
  });

  it("should set all plugins", () => {
    const myPlugins = [
      {
        id: "gattigaga-laravel",
        name: "Laravel",
        author: "Gattigaga Hayyuta Dewa",
        description: "Work on Laravel scheme and export to model and migration",
        license: "MIT",
        version: "0.1.0",
        icon: "path/image.png"
      }
    ];
    const expected = myPlugins;
    const action = setPlugins(myPlugins);
    const result = plugins(undefined, action);

    expect(result).toEqual(expected);
  });
});
