import React from "react";
import { shallow } from "enzyme";

import Sidebar from "../Sidebar";

const mockIcon = jest.fn();

describe("Sidebar", () => {
  const setup = propOverrides => {
    const props = {
      items: [
        {
          id: "workstage",
          icon: mockIcon,
          tooltip: "Workstage"
        },
        {
          id: "extensions",
          icon: mockIcon,
          tooltip: "Extensions"
        }
      ],
      onClickItem: jest.fn(),
      ...propOverrides
    };

    const wrapper = shallow(<Sidebar {...props} />);

    return {
      wrapper,
      props
    };
  };

  it("should renders default", () => {
    const { wrapper } = setup();

    expect(wrapper).toMatchSnapshot();
  });

  it("should renders with active item", () => {
    const { wrapper } = setup({ active: "extensions" });

    expect(wrapper).toMatchSnapshot();
  });

  it("should calls 'onClickItem' while item clicked", () => {
    const { wrapper, props } = setup();

    props.items.forEach((item, index) => {
      wrapper
        .find("Tool")
        .at(index)
        .simulate("click", item);

      expect(props.onClickItem).toBeCalledWith(item);
    });
  });
});
