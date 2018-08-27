import React from "react";
import { shallow } from "enzyme";
import "jest-styled-components";

import SmallButton, { Caption } from "../SmallButton";

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
    expect(wrapper).toHaveStyleRule("background", "#8e2929", {
      modifier: ":hover"
    });
    expect(wrapper.find(Caption)).toHaveStyleRule("color", "white");
  });

  it("should renders in disable", () => {
    const { wrapper } = setup({ isDisabled: true });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper).toHaveStyleRule("background", "#555");
    expect(wrapper).toHaveStyleRule("cursor", "not-allowed");
    expect(wrapper.find(Caption)).toHaveStyleRule("color", "#999");
  });

  it("should calls 'onClick' while clicked", () => {
    const { wrapper, props } = setup();

    wrapper.simulate("click");

    expect(props.onClick).toBeCalled();
  });

  it("should not calls 'onClick' while clicked in disabled", () => {
    const { wrapper, props } = setup({ isDisabled: true });

    wrapper.simulate("click");

    expect(props.onClick).not.toBeCalled();
  });
});
