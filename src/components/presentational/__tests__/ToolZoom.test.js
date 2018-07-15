import React from "react";
import { shallow } from "enzyme";
import toJSON from "enzyme-to-json";

import ToolZoom, { Select } from "../ToolZoom";

describe("ToolZoom", () => {
  const setup = propOverrides => {
    const props = {
      value: 25,
      tooltip: "Zoom",
      onChange: jest.fn(),
      ...propOverrides
    };

    const wrapper = shallow(<ToolZoom {...props} />);

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

    expect(wrapper.find(Select).props().disabled).toEqual(true);
  });

  it("should calls 'onChange' while changed", () => {
    const { wrapper, props } = setup();
    const event = {
      target: {
        value: 50
      }
    };

    wrapper.find(Select).simulate("change", event);

    expect(props.onChange).toBeCalledWith(event);
  });
});
