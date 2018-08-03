import React from "react";
import { shallow } from "enzyme";
import configureStore from "redux-mock-store";

import ConnectedComponent, {
  ExtensionListContainer
} from "../ExtensionListContainer";

jest.mock("../../presentational/ExtensionList", () => "ExtensionList");

describe("ExtensionListContainer", () => {
  const setup = propOverrides => {
    const props = {
      items: [
        {
          id: "1",
          name: "Laravel",
          author: "Gattigaga Hayyuta Dewa",
          description: "Export to Laravel",
          license: "MIT",
          version: "0.1.0",
          icon: "icon.png"
        },
        {
          id: "2",
          name: "SQL",
          author: "Gattigaga Hayyuta Dewa",
          description: "Export to SQL",
          license: "GPL",
          version: "1.0.0",
          icon: "icon.png"
        }
      ],
      keyword: "Laravel",
      ...propOverrides
    };

    const wrapper = shallow(<ExtensionListContainer {...props} />);

    return {
      wrapper,
      props
    };
  };

  const setupConnected = () => {
    const mockStore = configureStore();
    const store = mockStore({
      extensions: [
        {
          id: "1",
          name: "Laravel",
          author: "Gattigaga Hayyuta Dewa",
          description: "Export to Laravel",
          license: "MIT",
          version: "0.1.0",
          icon: "icon.png"
        },
        {
          id: "2",
          name: "SQL",
          author: "Gattigaga Hayyuta Dewa",
          description: "Export to SQL",
          license: "GPL",
          version: "1.0.0",
          icon: "icon.png"
        }
      ]
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

  it("should maps state to props", () => {
    const { wrapper, store } = setupConnected();
    const { extensions } = store.getState();

    expect(wrapper.props()).toMatchObject({ items: extensions });
  });
});
