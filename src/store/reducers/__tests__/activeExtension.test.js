import { setActiveExtension } from "../../actions/activeExtension";
import activeExtension from "../activeExtension";

describe("activeExtension()", () => {
  it("should returns initial state", () => {
    const expected = null;
    const result = activeExtension(undefined, {});

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

    const action = setActiveExtension(expected);
    const result = activeExtension(undefined, action);

    expect(result).toEqual(expected);
  });
});
