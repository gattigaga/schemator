import React from "react";
import { shallow } from "enzyme";
import configureStore from "redux-mock-store";

import ConnectedComponent, { SidebarContainer } from "../SidebarContainer";

describe("StatusbarContainer", () => {
  const setup = propOverrides => {
    const props = {
      page: "workarea",
      toPage: jest.fn(),
      ...propOverrides
    };

    const wrapper = shallow(<SidebarContainer {...props} />);

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

  it("should calls 'onClickItem' while item was clicked", () => {
    const { wrapper, props } = setup();
    const item = { id: "workarea" };

    wrapper
      .find("Sidebar")
      .props()
      .onClickItem(item);

    expect(props.toPage).toBeCalledWith(item.id);
  });

  it("should maps state to props", () => {
    const { wrapper, store } = setupConnected();
    const { page } = store.getState();

    expect(wrapper.props()).toMatchObject({ page });
  });

  it("should maps dispatch to props", () => {
    const { wrapper, store } = setupConnected();
    const { toPage } = wrapper.props();
    const pageID = "plugins";
    const expected = {
      type: "SET_PAGE",
      payload: pageID
    };

    toPage(pageID);

    expect(store.dispatch).toBeCalledWith(expected);
  });
});
