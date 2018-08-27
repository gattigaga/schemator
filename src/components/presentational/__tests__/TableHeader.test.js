import React from "react";
import { shallow } from "enzyme";

import TableHeader, { Caption } from "../TableHeader";

describe("TableHeader", () => {
  const setup = propOverrides => {
    const props = {
      caption: "User",
      onChangeCaption: jest.fn(),
      ...propOverrides
    };

    const wrapper = shallow(<TableHeader {...props} />);

    return {
      wrapper,
      props
    };
  };

  it("should renders default", () => {
    const { wrapper } = setup();

    expect(wrapper).toMatchSnapshot();
  });

  it("should calls 'onChangeCaption' while caption changed", () => {
    const { wrapper, props } = setup();
    const event = {
      target: {
        value: "Comment"
      }
    };

    wrapper.find(Caption).simulate("change", event);

    expect(props.onChangeCaption).toBeCalledWith(event);
  });
});
