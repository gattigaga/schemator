import React from "react";
import { shallow } from "enzyme";

import PluginList from "../PluginList";

describe("PluginList", () => {
  const setup = propOverrides => {
    const props = {
      items: [
        {
          id: "1",
          name: "Laravel Exporter",
          image: "image.png",
          author: "Gattigaga Hayyuta Dewa",
          description: "Export to Laravel file"
        },
        {
          id: "2",
          name: "SQL Exporter",
          image: "image.png",
          author: "Gattigaga Hayyuta Dewa",
          description: "Export to SQL file"
        },
        {
          id: "3",
          name: "MongoDB Exporter",
          image: "image.png",
          author: "Gattigaga Hayyuta Dewa",
          description: "Export to MongoDB file"
        }
      ],
      onClickItem: jest.fn(),
      ...propOverrides
    };

    const wrapper = shallow(<PluginList {...props} />);

    return {
      wrapper,
      props
    };
  };

  it("should renders default", () => {
    const { wrapper } = setup();

    expect(wrapper).toMatchSnapshot();
  });

  it("should renders with excerpt", () => {
    const { wrapper } = setup({
      items: [
        {
          id: "1",
          name: "Laravel Exporter",
          image: "image.png",
          author: "Gattigaga Hayyuta Dewa",
          description: "Export scheme to Laravel file"
        },
        {
          id: "2",
          name: "SQL Exporter",
          image: "image.png",
          author: "Gattigaga Hayyuta Dewa",
          description: "Export scheme to SQL file"
        },
        {
          id: "3",
          name: "MongoDB Exporter",
          image: "image.png",
          author: "Gattigaga Hayyuta Dewa",
          description: "Export scheme to MongoDB file"
        }
      ]
    });

    expect(wrapper).toMatchSnapshot();
  });

  it("should renders with keyword", () => {
    const { wrapper } = setup({ keyword: "mongo" });

    expect(wrapper).toMatchSnapshot();
  });

  it("should renders without plugins", () => {
    const { wrapper } = setup({ items: [] });

    expect(wrapper).toMatchSnapshot();
  });

  it("should renders with active item", () => {
    const { wrapper } = setup({ active: "2" });

    expect(wrapper).toMatchSnapshot();
  });

  it("should calls 'onClickItem' while item was clicked", () => {
    const { wrapper, props } = setup();

    props.items.forEach((item, index) => {
      wrapper
        .find("Plugin")
        .at(index)
        .simulate("click", item);

      expect(props.onClickItem).toBeCalledWith(item);
    });
  });
});
