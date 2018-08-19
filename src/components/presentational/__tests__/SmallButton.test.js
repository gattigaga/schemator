import React from "react";
import { shallow } from "enzyme";

import SmallButton from "../SmallButton";

describe("SmallButton", () => {
  const setup = propOverrides => {
    const props = {
      caption: "Remove",
      onClick: jest.fn(),
      ...propOverrides
    };

    const wrapper = shallow(<SmallButton {...props} />);

    return {
      wrapper,
      props
    };
  };

  it("should renders default", () => {
    const { wrapper } = setup();

    expect(wrapper).toMatchSnapshot();
  });

  it("should calls 'onClick' while clicked", () => {
    const { wrapper, props } = setup();

    wrapper.simulate("click");

    expect(props.onClick).toBeCalled();
  });
});
