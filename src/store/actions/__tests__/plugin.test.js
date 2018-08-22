import { SET_PLUGIN, setPlugin } from "../plugin";

describe("SET_PLUGIN", () => {
  it("should return expected action", () => {
    const plugin = {
      fieldTypes: [
        {
          id: "string",
          label: "STRING"
        }
      ]
    };

    const expected = {
      type: SET_PLUGIN,
      payload: plugin
    };

    const action = setPlugin(plugin);

    expect(action).toEqual(expected);
  });
});
