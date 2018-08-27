import { setPlugin } from "../../actions/plugin";
import plugin from "../plugin";

describe("plugin()", () => {
  it("should returns initial state", () => {
    const expected = null;
    const result = plugin(undefined, {});

    expect(result).toEqual(expected);
  });

  it("should set active plugin", () => {
    const expected = {
      fieldTypes: [
        {
          id: "string",
          label: "STRING"
        }
      ]
    };

    const action = setPlugin(expected);
    const result = plugin(undefined, action);

    expect(result).toEqual(expected);
  });
});
