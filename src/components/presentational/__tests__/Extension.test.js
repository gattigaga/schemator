import React from "react";
import { shallow } from "enzyme";

import Extension from "../Extension";

describe("Extension", () => {
  const setup = propOverrides => {
    const props = {
      name: "Schema",
      author: "Gattigaga Hayyuta Dewa",
      description: "Create schema in one screen.",
      image: "image.png",
      onClick: jest.fn(),
      ...propOverrides
    };

    const wrapper = shallow(<Extension {...props} />);

    return {
      wrapper,
      props
    };
  };

  it("should renders default", () => {
    const { wrapper } = setup();

    expect(wrapper).toMatchSnapshot();
  });

  it("should renders in active", () => {
    const { wrapper } = setup({ isActive: true });

    expect(wrapper.props().isActive).toEqual(true);
  });

  it("should calls 'onClick' while clicked", () => {
    const { wrapper, props } = setup();

    wrapper.simulate("click");

    expect(props.onClick).toBeCalled();
  });
});
