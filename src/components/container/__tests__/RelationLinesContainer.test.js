import React from "react";
import { shallow } from "enzyme";
import configureStore from "redux-mock-store";

import ConnectedComponent, {
  RelationLinesContainer
} from "../RelationLinesContainer";

jest.mock("../../presentational/RelationLines", () => "RelationLines");

describe("RelationLinesContainer", () => {
  const tables = [
    {
      id: "a79c8abc-bcc6-40e4-9c52-b8f343b91fec",
      name: "User",
      timestamp: 1530376280298,
      position: {
        x: 92,
        y: 110
      },
      options: {
        id: true,
        rememberToken: true,
        softDeletes: false,
        timestamps: true
      }
    },
    {
      id: "1817b56b-d1ba-47f9-983e-9f9fdc90a533",
      name: "Post",
      timestamp: 1530377404366,
      position: {
        x: 548,
        y: 784
      },
      options: {
        id: true,
        rememberToken: false,
        softDeletes: false,
        timestamps: true
      }
    }
  ];

  const fields = [
    [
      {
        id: "079cff9a-7603-4d7a-b178-2da03d6faf8c",
        tableID: "a79c8abc-bcc6-40e4-9c52-b8f343b91fec",
        name: "name",
        type: "STRING"
      },
      {
        id: "34fd94df-d5d4-41ab-8f01-a2b95a2b2050",
        tableID: "a79c8abc-bcc6-40e4-9c52-b8f343b91fec",
        name: "email",
        type: "STRING"
      },
      {
        id: "6f159bff-ebe0-4d4e-8794-b75a1a34f79c",
        tableID: "a79c8abc-bcc6-40e4-9c52-b8f343b91fec",
        name: "password",
        type: "STRING"
      },
      {
        id: "26737c00-7a54-4b58-b112-f17060fa49f6",
        tableID: "1817b56b-d1ba-47f9-983e-9f9fdc90a533",
        name: "title",
        type: "INTEGER"
      },
      {
        tableID: "1817b56b-d1ba-47f9-983e-9f9fdc90a533",
        id: "ccbc8a47-ae75-4ab6-8d6f-7a90747d60be",
        name: "user_id",
        type: "INTEGER"
      },
      {
        tableID: "1817b56b-d1ba-47f9-983e-9f9fdc90a533",
        id: "5c0b69d3-f527-4a02-a095-1342f392b2c8",
        name: "content",
        type: "TEXT"
      }
    ]
  ];

  const relations = [
    {
      id: "5dde1193-9c8f-4c45-bb1e-58455cb2a7d8",
      fieldID: "ccbc8a47-ae75-4ab6-8d6f-7a90747d60be",
      fromTableID: "1817b56b-d1ba-47f9-983e-9f9fdc90a533",
      toTableID: "a79c8abc-bcc6-40e4-9c52-b8f343b91fec"
    }
  ];

  const setup = propOverrides => {
    const props = {
      tables,
      fields,
      relations,
      ...propOverrides
    };

    const wrapper = shallow(<RelationLinesContainer {...props} />);

    return {
      wrapper,
      props
    };
  };

  const setupConnected = () => {
    const mockStore = configureStore();
    const store = mockStore({
      tables,
      fields,
      relations
    });

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
    const { tables, fields, relations } = store.getState();

    expect(wrapper.props()).toMatchObject({
      tables,
      fields,
      relations
    });
  });
});
