import { createOption } from "../../extension";

describe("createOption()", () => {
  it("should returns new option object without checked", () => {
    const expected = {
      id: "id",
      label: "ID",
      isChecked: false
    };

    const result = createOption("id", "ID");

    expect(result).toEqual(expected);
  });

  it("should returns new option object", () => {
    const expected = {
      id: "id",
      label: "ID",
      isChecked: true
    };

    const result = createOption("id", "ID", true);

    expect(result).toEqual(expected);
  });
});
