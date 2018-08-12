import React, { createRef } from "react";
import { shallow } from "enzyme";

import TableList from "../TableList";

jest.mock("../TableBox", () => "TableBox");

describe("TableList", () => {
  const setup = propOverrides => {
    const props = {
      types: [
        {
          id: "string",
          label: "String"
        },
        {
          id: "integer",
          label: "Integer"
        },
        {
          id: "text",
          label: "Text"
        }
      ],
      tables: [
        {
          id: "a79c8abc-bcc6-40e4-9c52-b8f343b91fec",
          ref: createRef(),
          name: "User",
          timestamp: 1530376280298,
          position: {
            x: 92,
            y: 110
          },
          options: [
            {
              id: "id",
              label: "ID",
              isChecked: true
            },
            {
              id: "rememberToken",
              label: "Remember Token",
              isChecked: false
            },
            {
              id: "softDeletes",
              label: "Soft Deletes",
              isChecked: false
            },
            {
              id: "timestamps",
              label: "Timestamps",
              isChecked: false
            }
          ]
        },
        {
          id: "1817b56b-d1ba-47f9-983e-9f9fdc90a533",
          ref: createRef(),
          name: "Post",
          timestamp: 1530377404366,
          position: {
            x: 548,
            y: 784
          },
          options: [
            {
              id: "id",
              label: "ID",
              isChecked: true
            },
            {
              id: "rememberToken",
              label: "Remember Token",
              isChecked: false
            },
            {
              id: "softDeletes",
              label: "Soft Deletes",
              isChecked: false
            },
            {
              id: "timestamps",
              label: "Timestamps",
              isChecked: false
            }
          ]
        }
      ],
      fields: [
        {
          id: "079cff9a-7603-4d7a-b178-2da03d6faf8c",
          tableID: "a79c8abc-bcc6-40e4-9c52-b8f343b91fec",
          name: "name",
          type: "string"
        },
        {
          id: "34fd94df-d5d4-41ab-8f01-a2b95a2b2050",
          tableID: "a79c8abc-bcc6-40e4-9c52-b8f343b91fec",
          name: "email",
          type: "string"
        },
        {
          id: "6f159bff-ebe0-4d4e-8794-b75a1a34f79c",
          tableID: "a79c8abc-bcc6-40e4-9c52-b8f343b91fec",
          name: "password",
          type: "string"
        },
        {
          id: "26737c00-7a54-4b58-b112-f17060fa49f6",
          tableID: "1817b56b-d1ba-47f9-983e-9f9fdc90a533",
          name: "title",
          type: "string"
        },
        {
          tableID: "1817b56b-d1ba-47f9-983e-9f9fdc90a533",
          id: "ccbc8a47-ae75-4ab6-8d6f-7a90747d60be",
          name: "user_id",
          type: "integer"
        },
        {
          tableID: "1817b56b-d1ba-47f9-983e-9f9fdc90a533",
          id: "5c0b69d3-f527-4a02-a095-1342f392b2c8",
          name: "content",
          type: "text"
        }
      ],
      onMouseDown: jest.fn(),
      onMouseUp: jest.fn(),
      onMouseMove: jest.fn(),
      onMouseEnter: jest.fn(),
      onMouseLeave: jest.fn(),
      onContextMenu: jest.fn(),
      onClickAddField: jest.fn(),
      onClickRemoveField: jest.fn(),
      onChangeField: jest.fn(),
      onChangeName: jest.fn(),
      onChangeOptions: jest.fn(),
      ...propOverrides
    };

    const wrapper = shallow(<TableList {...props} />);

    return {
      wrapper,
      props
    };
  };

  it("should renders default", () => {
    const { wrapper } = setup();

    expect(wrapper).toMatchSnapshot();
  });

  it("should calls 'onMouseDown' while mouse down on TableBox", () => {
    const { wrapper, props } = setup();
    const event = {};

    props.tables.forEach((table, index) => {
      wrapper
        .find("TableBox")
        .at(index)
        .props()
        .onMouseDown(event, table.id);

      expect(props.onMouseDown).toBeCalledWith(event, table.id);
    });
  });

  it("should calls 'onMouseUp' while mouse up on TableBox", () => {
    const { wrapper, props } = setup();
    const event = {};

    props.tables.forEach((table, index) => {
      wrapper
        .find("TableBox")
        .at(index)
        .props()
        .onMouseUp(event, table.id);

      expect(props.onMouseUp).toBeCalledWith(event, table.id);
    });
  });

  it("should calls 'onMouseMove' while mouse move on TableBox", () => {
    const { wrapper, props } = setup();
    const event = {};

    props.tables.forEach((table, index) => {
      wrapper
        .find("TableBox")
        .at(index)
        .props()
        .onMouseMove(event, table.id);

      expect(props.onMouseMove).toBeCalledWith(event, table.id);
    });
  });

  it("should calls 'onMouseEnter' while mouse entering TableBox", () => {
    const { wrapper, props } = setup();

    props.tables.forEach((table, index) => {
      wrapper
        .find("TableBox")
        .at(index)
        .props()
        .onMouseEnter(table.id);

      expect(props.onMouseEnter).toBeCalledWith(table.id);
    });
  });

  it("should calls 'onMouseLeave' while mouse leaving TableBox", () => {
    const { wrapper, props } = setup();

    props.tables.forEach((table, index) => {
      wrapper
        .find("TableBox")
        .at(index)
        .props()
        .onMouseLeave(table.id);

      expect(props.onMouseLeave).toBeCalledWith(table.id);
    });
  });

  it("should calls 'onContextMenu' while context menu shown in TableBox", () => {
    const { wrapper, props } = setup();

    props.tables.forEach((table, index) => {
      wrapper
        .find("TableBox")
        .at(index)
        .props()
        .onContextMenu(table.id);

      expect(props.onContextMenu).toBeCalledWith(table.id);
    });
  });

  it("should calls 'onClickAddField' while add field button clicked in TableBox", () => {
    const { wrapper, props } = setup();

    props.tables.forEach((table, index) => {
      wrapper
        .find("TableBox")
        .at(index)
        .props()
        .onClickAddField(table.id);

      expect(props.onClickAddField).toBeCalledWith(table.id);
    });
  });

  it("should calls 'onClickRemoveField' while remove field button clicked in TableBox", () => {
    const { wrapper, props } = setup();

    props.tables.forEach((table, index) => {
      wrapper
        .find("TableBox")
        .at(index)
        .props()
        .onClickRemoveField();

      expect(props.onClickRemoveField).toBeCalled();
    });
  });

  it("should calls 'onChangeField' while field name changed in TableBox", () => {
    const { wrapper, props } = setup();
    const event = {};
    const fieldID = "field-id-12345";

    props.tables.forEach((table, index) => {
      wrapper
        .find("TableBox")
        .at(index)
        .props()
        .onChangeFieldName(event, fieldID);

      expect(props.onChangeField).toBeCalledWith(event, fieldID, "name");
    });
  });

  it("should calls 'onChangeField' while field type changed in TableBox", () => {
    const { wrapper, props } = setup();
    const event = {};
    const fieldID = "field-id-12345";

    props.tables.forEach((table, index) => {
      wrapper
        .find("TableBox")
        .at(index)
        .props()
        .onChangeFieldType(event, fieldID);

      expect(props.onChangeField).toBeCalledWith(event, fieldID, "type");
    });
  });

  it("should calls 'onChangeName' while table name changed in TableBox", () => {
    const { wrapper, props } = setup();
    const event = {};

    props.tables.forEach((table, index) => {
      wrapper
        .find("TableBox")
        .at(index)
        .props()
        .onChangeName(event, table.id);

      expect(props.onChangeName).toBeCalledWith(event, table.id);
    });
  });

  it("should calls 'onChangeOptions' while options changed in TableBox", () => {
    const { wrapper, props } = setup();
    const event = {};
    const name = "rememberToken";

    props.tables.forEach((table, index) => {
      wrapper
        .find("TableBox")
        .at(index)
        .props()
        .onChangeOptions(event, name);

      expect(props.onChangeOptions).toBeCalledWith(event, table.id, name);
    });
  });
});
