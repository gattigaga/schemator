import { SET_EXTENSION, setExtension } from "../extension";

describe("SET_EXTENSION", () => {
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
      type: SET_EXTENSION,
      payload: extension
    };

    const action = setExtension(extension);

    expect(action).toEqual(expected);
  });
});
