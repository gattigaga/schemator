import React from "react";
import { shallow } from "enzyme";

import Statusbar from "../Statusbar";

describe("Statusbar", () => {
  const setup = propOverrides => {
    const props = {
      zoom: 75,
      pluginName: "Schemator Laravel",
      projectName: "LaravelScheme",
      isProjectModified: false,
      ...propOverrides
    };

    const wrapper = shallow(<Statusbar {...props} />);

    return {
      wrapper,
      props
    };
  };

  it("should renders default", () => {
    const { wrapper } = setup();

    expect(wrapper).toMatchSnapshot();
  });

  it("should renders without opened project", () => {
    const { wrapper } = setup({ projectName: "" });

    expect(wrapper).toMatchSnapshot();
  });

  it("should renders with modified project", () => {
    const { wrapper } = setup({ isProjectModified: true });

    expect(wrapper).toMatchSnapshot();
  });
});
