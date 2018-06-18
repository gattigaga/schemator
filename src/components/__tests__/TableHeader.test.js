import React from "react";
import { shallow } from "enzyme";
import toJSON from "enzyme-to-json";

import TableHeader from "../TableHeader";

describe("TableHeader", () => {
  const setup = propOverrides => {
    const props = {
      caption: "User",
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

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
