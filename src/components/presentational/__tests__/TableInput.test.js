import React from "react";
import { shallow } from "enzyme";

import TableInput, { CloseButton, Input, Select } from "../TableInput";

describe("TableInput", () => {
  const setup = propOverrides => {
    const props = {
      name: "username",
      type: "string",
      types: [
        {
          id: "string",
          label: "String"
        },
        {
          id: "boolean",
          label: "Boolean"
        },
        {
          id: "char",
          label: "Char"
        }
      ],
      onChangeName: jest.fn(),
      onChangeType: jest.fn(),
      onClickRemove: jest.fn(),
      ...propOverrides
    };

    const wrapper = shallow(<TableInput {...props} />);

    return {
      wrapper,
      props
    };
  };

  it("should renders default", () => {
    const { wrapper } = setup();

    expect(wrapper).toMatchSnapshot();
  });

  it("should renders with disabled selection", () => {
    const { wrapper } = setup({ isTypeDisabled: true });

    expect(wrapper.find(Select).props().disabled).toEqual(true);
  });

  it("should calls 'onClickRemove' while Remove button was clicked", () => {
    const { wrapper, props } = setup();

    wrapper.find(CloseButton).simulate("click");

    expect(props.onClickRemove).toBeCalled();
  });

  it("should calls 'onChangeName' while field name was changed", () => {
    const { wrapper, props } = setup();
    const event = {
      target: {
        value: "id"
      }
    };

    wrapper.find(Input).simulate("change", event);

    expect(props.onChangeName).toBeCalledWith(event);
  });

  it("should calls 'onChangeType' while field type was changed", () => {
    const { wrapper, props } = setup();
    const event = {
      target: {
        value: "BIGINT"
      }
    };

    wrapper.find(Select).simulate("change", event);

    expect(props.onChangeType).toBeCalledWith(event);
  });
});
