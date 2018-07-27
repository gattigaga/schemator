import React from "react";
import { shallow } from "enzyme";

import ExtensionList from "../ExtensionList";

describe("ExtensionList", () => {
  const setup = propOverrides => {
    const props = {
      items: [
        {
          name: "Laravel Exporter",
          image: "image.png",
          author: "Gattigaga Hayyuta Dewa",
          description: "Export to Laravel file"
        },
        {
          name: "SQL Exporter",
          image: "image.png",
          author: "Gattigaga Hayyuta Dewa",
          description: "Export to SQL file"
        },
        {
          name: "MongoDB Exporter",
          image: "image.png",
          author: "Gattigaga Hayyuta Dewa",
          description: "Export to MongoDB file"
        }
      ],
      onClickItem: jest.fn(),
      ...propOverrides
    };

    const wrapper = shallow(<ExtensionList {...props} />);

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
          name: "Laravel Exporter",
          image: "image.png",
          author: "Gattigaga Hayyuta Dewa",
          description: "Export scheme to Laravel file"
        },
        {
          name: "SQL Exporter",
          image: "image.png",
          author: "Gattigaga Hayyuta Dewa",
          description: "Export scheme to SQL file"
        },
        {
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

  it("should renders without extensions", () => {
    const { wrapper } = setup({ items: [] });

    expect(wrapper).toMatchSnapshot();
  });

  it("should calls 'onClickItem' while item was clicked", () => {
    const { wrapper, props } = setup();

    props.items.forEach((item, index) => {
      wrapper
        .find("Extension")
        .at(index)
        .simulate("click", item);

      expect(props.onClickItem).toBeCalledWith(item);
    });
  });
});
