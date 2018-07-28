import React from "react";
import { shallow } from "enzyme";
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

    expect(wrapper).toMatchSnapshot();
  });

  it("should renders without tooltip", () => {
    const { wrapper } = setup({ tooltip: "" });

    expect(wrapper).toMatchSnapshot();
  });

  it("should renders in active", () => {
    const { wrapper } = setup({ isActive: true });

    expect(wrapper).toMatchSnapshot();
  });

  it("should calls 'onClick' while clicked", () => {
    const { wrapper, props } = setup();

    wrapper.simulate("click");

    expect(props.onClick).toBeCalled();
  });
});
