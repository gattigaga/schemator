import { createTable } from "../../layout";
import store from "../../../store/store";

describe("createTable()", () => {
  it("should create new table", () => {
    store.dispatch = jest.fn();
    const position = { x: 32, y: 32 };

    createTable(position);

    expect(store.dispatch).toHaveBeenCalledTimes(3);
  });
});
