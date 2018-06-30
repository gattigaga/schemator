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

  it("should returns created migration with multiple words table", () => {
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

    const result = migrationTemplate("UserOrderNote", options, fields);

    expect(result).toMatchSnapshot();
  });

  it("should returns created migration which has relation", () => {
    const fields = [
      {
        name: "user_id",
        type: "integer"
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

    const result = migrationTemplate("Post", options, fields);

    expect(result).toMatchSnapshot();
  });
});
