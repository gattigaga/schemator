import { migrationTemplate } from "../../helpers";

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

    const options = [
      {
        id: "id",
        label: "ID",
        isChecked: true
      },
      {
        id: "rememberToken",
        label: "Remember Token",
        isChecked: true
      },
      {
        id: "softDeletes",
        label: "Soft Deletes",
        isChecked: true
      },
      {
        id: "timestamps",
        label: "Timestamps",
        isChecked: true
      }
    ];

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

    const options = [
      {
        id: "id",
        label: "ID",
        isChecked: true
      },
      {
        id: "rememberToken",
        label: "Remember Token",
        isChecked: true
      },
      {
        id: "softDeletes",
        label: "Soft Deletes",
        isChecked: true
      },
      {
        id: "timestamps",
        label: "Timestamps",
        isChecked: true
      }
    ];

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

    const options = [
      {
        id: "id",
        label: "ID",
        isChecked: true
      },
      {
        id: "rememberToken",
        label: "Remember Token",
        isChecked: true
      },
      {
        id: "softDeletes",
        label: "Soft Deletes",
        isChecked: true
      },
      {
        id: "timestamps",
        label: "Timestamps",
        isChecked: true
      }
    ];

    const result = migrationTemplate("Post", options, fields);

    expect(result).toMatchSnapshot();
  });
});
