import { setPage } from "../../actions/page";
import page from "../page";

describe("page()", () => {
  it("should returns initial state", () => {
    const expected = "workarea";
    const result = page(undefined, {});

    expect(result).toEqual(expected);
  });

  it("should set active page", () => {
    const expected = "extensions";
    const action = setPage(expected);
    const result = page(undefined, action);

    expect(result).toEqual(expected);
  });
});
