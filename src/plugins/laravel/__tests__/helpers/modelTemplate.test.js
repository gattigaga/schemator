import { modelTemplate } from "../../helpers";

describe("modelTemplate()", () => {
  it("should returns created model", () => {
    const fields = ["username", "email", "fullname"];
    const result = modelTemplate("User", fields);

    expect(result).toMatchSnapshot();
  });
});
