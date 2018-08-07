import React from "react";
import { shallow } from "enzyme";

import RelationLines from "../RelationLines";

describe("RelationLines", () => {
  const setup = propOverrides => {
    const props = {
      items: [
        {
          x1: 32,
          y1: 32,
          x2: 128,
          y2: 128
        },
        {
          x1: 240,
          y1: 32,
          x2: 160,
          y2: 128
        }
      ],
      ...propOverrides
    };

    const wrapper = shallow(<RelationLines {...props} />);

    return {
      wrapper,
      props
    };
  };

  it("should renders default", () => {
    const { wrapper } = setup();

    expect(wrapper).toMatchSnapshot();
  });
});
