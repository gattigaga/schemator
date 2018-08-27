import React from "react";
import { shallow } from "enzyme";
import "jest-styled-components";

import Plugin from "../Plugin";

describe("Plugin", () => {
  const setup = propOverrides => {
    const props = {
      name: "Schema",
      author: "Gattigaga Hayyuta Dewa",
      description: "Create schema in one screen.",
      image: "image.png",
      onClick: jest.fn(),
      ...propOverrides
    };

    const wrapper = shallow(<Plugin {...props} />);

    return {
      wrapper,
      props
    };
  };

  it("should renders default", () => {
    const { wrapper } = setup();

    expect(wrapper).toMatchSnapshot();
    expect(wrapper).toHaveStyleRule("background", "#333");
  });

  it("should renders in active", () => {
    const { wrapper } = setup({ isActive: true });

    expect(wrapper.props().isActive).toEqual(true);
    expect(wrapper).toHaveStyleRule("background", "#3b3b3b");
  });

  it("should calls 'onClick' while clicked", () => {
    const { wrapper, props } = setup();

    wrapper.simulate("click");

    expect(props.onClick).toBeCalled();
  });
});
