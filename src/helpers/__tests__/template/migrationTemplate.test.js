import { migrationTemplate } from "../../template";

describe("migrationTemplate()", () => {
  it("should returns created migration", () => {
    const fields = [
      {
        name: "fullname",
        type: "string"
      },
      {
        name: "username",
        type: "string"
      }
    ];
    const options = {
      id: true,
      rememberToken: true,
      softDeletes: true,
      timestamps: true
    };

    const result = migrationTemplate("User", options, fields);

    expect(result).toMatchSnapshot();
  });
});
