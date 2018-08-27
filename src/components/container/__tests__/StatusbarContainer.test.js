import React from "react";
import { shallow } from "enzyme";
import configureStore from "redux-mock-store";

import ConnectedComponent, { StatusbarContainer } from "../StatusbarContainer";

describe("StatusbarContainer", () => {
  const setup = propOverrides => {
    const props = {
      project: {
        name: "LaravelScheme",
        zoom: 75,
        isModified: false
      },
      plugin: {
        name: "Schemator Laravel"
      },
      ...propOverrides
    };

    const wrapper = shallow(<StatusbarContainer {...props} />);

    return {
      wrapper,
      props
    };
  };

  const setupConnected = () => {
    const mockStore = configureStore();
    const store = mockStore({
      project: {
        name: "LaravelScheme",
        zoom: 75,
        isModified: false
      },
      plugin: {
        name: "Schemator Laravel"
      }
    });

    const wrapper = shallow(<ConnectedComponent store={store} />);

    return {
      wrapper,
      store
    };
  };

  it("should renders with project", () => {
    const { wrapper } = setup();

    expect(wrapper).toMatchSnapshot();
  });

  it("should renders without opened project", () => {
    const { wrapper } = setup({ project: null });

    expect(wrapper).toMatchSnapshot();
  });

  it("should maps state to props", () => {
    const { wrapper, store } = setupConnected();
    const { project, plugin } = store.getState();

    expect(wrapper.props()).toMatchObject({ project, plugin });
  });
});
