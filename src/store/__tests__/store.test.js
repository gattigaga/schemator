import store from "../store";

describe("store", () => {
  it("should not error", () => {
    const state = store.getState();

    expect(state).toMatchSnapshot();
  });
});
