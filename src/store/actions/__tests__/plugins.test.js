import { SET_PLUGINS, setPlugins } from "../plugins";

describe("SET_PLUGINS", () => {
  it("should return expected action", () => {
    const plugins = [
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

    const expected = {
      type: SET_PLUGINS,
      payload: plugins
    };

    const action = setPlugins(plugins);

    expect(action).toEqual(expected);
  });
});
