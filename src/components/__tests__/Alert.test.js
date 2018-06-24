import React from "react";
import { shallow } from "enzyme";
import configureStore from "redux-mock-store";
import toJSON from "enzyme-to-json";
import MdInfo from "react-icons/lib/md/info";

import ConnectedComponent, { Alert } from "../Alert";

describe("Alert", () => {
  const mockStore = configureStore();

  const setup = (props = {}, isConnected = true) => {
    const store = mockStore({
      alert: {
        isOpen: false,
        iconColor: "black",
        message: "My message"
      }
    });
    store.dispatch = jest.fn();

    const wrapper = isConnected
      ? shallow(<ConnectedComponent store={store} />)
      : shallow(<Alert {...props} />);

    return {
      wrapper,
      store
    };
  };

  it("should renders default", () => {
    const alertData = {
      isOpen: false,
      iconColor: "black",
      icon: MdInfo,
      message: "My message"
    };
    const { wrapper } = setup({ ...alertData }, false);

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it("should maps state and dispatch to props", () => {
    const alertData = {
      isOpen: false,
      iconColor: "black",
      message: "My message"
    };

    const { wrapper } = setup();

    expect(wrapper.props()).toMatchObject({
      ...alertData,
      showAlert: expect.any(Function)
    });
  });

  it("should maps showAlert to dispatch set alert action", () => {
    const { wrapper, store } = setup();
    const options = {
      isOpen: false,
      iconColor: "black",
      message: "My message"
    };

    wrapper.props().showAlert(options);

    expect(store.dispatch).toBeCalledWith({
      type: "SET_ALERT",
      payload: options
    });
  });
});
