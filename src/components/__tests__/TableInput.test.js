import React from "react";
import { shallow } from "enzyme";
import toJSON from "enzyme-to-json";

import TableInput, { CloseButton, Input, Select } from "../TableInput";

describe("TableInput", () => {
  const setup = propOverrides => {
    const props = {
      name: "username",
      type: "STRING",
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

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it("should renders with disabled selection", () => {
    const { wrapper } = setup({
      name: "user_id",
      type: "INTEGER"
    });

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
