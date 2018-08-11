import { setExtension } from "../../actions/extension";
import extension from "../extension";

describe("extension()", () => {
  it("should returns initial state", () => {
    const expected = null;
    const result = extension(undefined, {});

    expect(result).toEqual(expected);
  });

  it("should set active extension", () => {
    const expected = {
      tableOptions: [
        {
          id: "id",
          label: "ID",
          isChecked: false
        }
      ],
      fieldTypes: ["STRING"]
    };

    const action = setExtension(expected);
    const result = extension(undefined, action);

    expect(result).toEqual(expected);
  });
});
