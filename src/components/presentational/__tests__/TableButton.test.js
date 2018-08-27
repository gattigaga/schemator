import React from "react";
import { shallow } from "enzyme";

import TableButton from "../TableButton";

describe("TableButton", () => {
  const setup = propOverrides => {
    const props = {
      caption: "Add New Field",
      onClick: jest.fn(),
      ...propOverrides
    };

    const wrapper = shallow(<TableButton {...props} />);

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
