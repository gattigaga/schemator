import { SET_PAGE, setPage } from "../page";

describe("SET_PAGE", () => {
  it("should return expected action", () => {
    const pageID = "workarea";

    const expected = {
      type: SET_PAGE,
      payload: pageID
    };

    const action = setPage(pageID);

    expect(action).toEqual(expected);
  });
});
