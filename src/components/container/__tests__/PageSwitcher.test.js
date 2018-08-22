import React from "react";
import { shallow } from "enzyme";
import configureStore from "redux-mock-store";

import ConnectedComponent, { PageSwitcher } from "../PageSwitcher";

jest.mock("../WorkArea", () => "WorkArea");
jest.mock("../Plugins", () => "Plugins");

describe("PageSwitcher", () => {
  const setup = propOverrides => {
    const props = {
      page: null,
      ...propOverrides
    };

    const wrapper = shallow(<PageSwitcher {...props} />);

    return {
      wrapper,
      props
    };
  };

  const setupConnected = () => {
    const mockStore = configureStore();
    const store = mockStore({
      page: "workarea"
    });

    store.dispatch = jest.fn();

    const wrapper = shallow(<ConnectedComponent store={store} />);

    return {
      wrapper,
      store
    };
  };

  it("should renders default", () => {
    const { wrapper } = setup();

    expect(wrapper).toMatchSnapshot();
  });

  it("should renders as specified page", () => {
    const pages = ["workarea", "plugins"];

    pages.forEach(page => {
      const { wrapper } = setup({ page });
      expect(wrapper).toMatchSnapshot();
    });
  });

  it("should maps state to props", () => {
    const { wrapper, store } = setupConnected();
    const { page } = store.getState();

    expect(wrapper.props()).toMatchObject({ page });
  });
});
