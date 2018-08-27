import React from "react";
import { shallow } from "enzyme";

import SearchBox from "../SearchBox";

describe("SearchBox", () => {
  const setup = propOverrides => {
    const props = {
      value: "Laravel",
      onChange: jest.fn(),
      ...propOverrides
    };

    const wrapper = shallow(<SearchBox {...props} />);

    return {
      wrapper,
      props
    };
  };

  it("should renders default", () => {
    const { wrapper } = setup();

    expect(wrapper).toMatchSnapshot();
  });

  it("should calls 'onChange' while changed", () => {
    const { wrapper, props } = setup();

    wrapper.simulate("change");

    expect(props.onChange).toBeCalled();
  });
});
