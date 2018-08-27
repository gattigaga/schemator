import React from "react";
import { shallow } from "enzyme";

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

    expect(wrapper).toMatchSnapshot();
  });

  it("should renders with addtional class", () => {
    const { wrapper } = setup({ className: "my-class" });

    expect(wrapper).toMatchSnapshot();
  });
});
