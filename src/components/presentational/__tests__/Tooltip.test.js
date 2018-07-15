import React from "react";
import { shallow } from "enzyme";
import toJSON from "enzyme-to-json";

import Tooltip from "../Tooltip";

describe("Tooltip", () => {
  const setup = propOverrides => {
    const props = {
      text: "My Tooltip",
      ...propOverrides
    };

    const wrapper = shallow(<Tooltip {...props} />);

    return {
      wrapper,
      props
    };
  };

  it("should renders default", () => {
    const { wrapper } = setup();

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it("should renders with addtional class", () => {
    const { wrapper } = setup({ className: "my-class" });

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
