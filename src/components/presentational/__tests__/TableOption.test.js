import React from "react";
import { shallow } from "enzyme";
import "jest-styled-components";

import TableOption, { Item, Input } from "../TableOption";

describe("TableOption", () => {
  const setup = propOverrides => {
    const props = {
      items: [
        { id: "id", label: "ID", isChecked: true },
        { id: "rememberToken", label: "Remember Token", isChecked: false }
      ],
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
    const item = wrapper.find(Item);

    expect(item.at(0)).toHaveStyleRule("margin-right", "16px");
    expect(item.at(1)).toHaveStyleRule("margin-right", "0px");
    expect(wrapper).toMatchSnapshot();
  });

  it("should calls 'onChange' while changed", () => {
    const { wrapper, props } = setup();
    const optionIDs = ["id", "rememberToken"];

    const event = {
      target: {
        checked: true
      }
    };

    optionIDs.forEach((item, index) => {
      wrapper
        .find(Input)
        .at(index)
        .simulate("change", event, item);

      expect(props.onChange).toBeCalledWith(event, item);
    });
  });
});
