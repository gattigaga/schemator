import React from "react";
import { shallow } from "enzyme";
import configureStore from "redux-mock-store";
import MdInfo from "react-icons/lib/md/info";

import AlertContainer from "../AlertContainer";

describe("AlertContainer", () => {
  const setup = () => {
    const mockStore = configureStore();
    const store = mockStore({
      alert: {
        isOpen: false,
        iconColor: "black",
        icon: MdInfo,
        message: "My message",
        onClickOK: jest.fn(),
        onRequestClose: jest.fn()
      }
    });

    const wrapper = shallow(<AlertContainer store={store} />);

    return {
      wrapper,
      store
    };
  };

  it("should maps state to props", () => {
    const { wrapper, store } = setup();
    const { alert } = store.getState();

    expect(wrapper.props()).toMatchObject(alert);
  });
});
