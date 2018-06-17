import React from "react";
import { shallow } from "enzyme";
import toJSON from "enzyme-to-json";
import IconSave from "react-icons/lib/md/save";

import Tool from "../Tool";

describe("Tool", () => {
  const setup = propOverrides => {
    const props = {
      tooltip: "Save Schema",
      icon: IconSave,
      onClick: jest.fn(),
      ...propOverrides
    };

    const wrapper = shallow(<Tool {...props} />);

    return {
      wrapper,
      props
    };
  };

  it("should renders default", () => {
    const { wrapper } = setup();

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it("should renders as disabled", () => {
    const { wrapper } = setup({ isDisabled: true });

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it("should calls 'onClick' while clicked", () => {
    const { wrapper, props } = setup();

    wrapper.simulate("click");

    expect(props.onClick).toBeCalled();
  });

  it("should not calls 'onClick' while clicked in disable", () => {
    const { wrapper, props } = setup({ isDisabled: true });

    wrapper.simulate("click");

    expect(props.onClick).not.toBeCalled();
  });
});
