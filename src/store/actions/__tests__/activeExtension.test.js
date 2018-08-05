import { SET_ACTIVE_EXTENSION, setActiveExtension } from "../activeExtension";

describe("SET_ACTIVE_EXTENSION", () => {
  it("should return expected action", () => {
    const extension = {
      tableOptions: [
        {
          id: "id",
          label: "ID",
          isChecked: false
        }
      ],
      fieldTypes: ["STRING"]
    };

    const expected = {
      type: SET_ACTIVE_EXTENSION,
      payload: extension
    };

    const action = setActiveExtension(extension);

    expect(action).toEqual(expected);
  });
});
