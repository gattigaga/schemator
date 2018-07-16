import { CLEAR_PROJECT, clearProject } from "../../actions";

describe("CLEAR_PROJECT", () => {
  it("should return expected action", () => {
    const expected = {
      type: CLEAR_PROJECT
    };

    const action = clearProject();

    expect(action).toEqual(expected);
  });
});
