import React from "react";
import { shallow } from "enzyme";

import BGLines from "../BGLines";

describe("BGLines", () => {
  const setup = propOverrides => {
    const props = {
      totalHorizontal: 3,
      totalVertical: 3,
      gap: 32,
      ...propOverrides
    };

    const wrapper = shallow(<BGLines {...props} />);

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
