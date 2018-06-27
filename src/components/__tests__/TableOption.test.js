import React from "react";
import { shallow } from "enzyme";
import toJSON from "enzyme-to-json";

import TableOption, { Input } from "../TableOption";

describe("TableOption", () => {
  const setup = propOverrides => {
    const props = {
      value: {
        id: true,
        rememberToken: true,
        softDeletes: true,
        timestamps: true
      },
      onChange: jest.fn(),
      ...propOverrides
    };

    const wrapper = shallow(<TableOption {...props} />);

    return {
      wrapper,
      props
    };
  };

  it("should renders default", () => {
    const { wrapper } = setup();

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it("should calls 'onChange' while changed", () => {
    const { wrapper, props } = setup();
    const $wrapper = wrapper.find(Input);
    const options = ["id", "rememberToken", "softDeletes", "timestamps"];

    const event = {
      target: {
        checked: true
      }
    };

    options.forEach((item, index) => {
      $wrapper.at(index).simulate("change", event);
      expect(props.onChange).toBeCalledWith(event, item);
    });
  });
});
