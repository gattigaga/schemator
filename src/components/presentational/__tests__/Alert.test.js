import React from "react";
import { shallow } from "enzyme";
import toJSON from "enzyme-to-json";
import MdInfo from "react-icons/lib/md/info";

import Alert, { Button } from "../Alert";

describe("Alert", () => {
  const setup = propOverrides => {
    const props = {
      isOpen: false,
      iconColor: "black",
      message: "My message",
      icon: MdInfo,
      onClickOK: jest.fn(),
      onRequestClose: jest.fn(),
      ...propOverrides
    };

    const wrapper = shallow(<Alert {...props} />);

    return {
      wrapper,
      props
    };
  };

  it("should renders default", () => {
    const { wrapper } = setup();

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it("should calls 'onClickOK' while OK button clicked", () => {
    const { wrapper, props } = setup();

    wrapper.find(Button).simulate("click");

    expect(props.onClickOK).toBeCalled();
  });
});
