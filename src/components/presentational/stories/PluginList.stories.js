import React from "react";
import { storiesOf, action } from "@storybook/react";
import styled from "styled-components";

import imgIcon from "../../../assets/images/icon-black.png";
import PluginList from "../PluginList";

const Container = styled.div`
  width: 240px;
`;

storiesOf("PluginList", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => (
    <PluginList
      items={[
        {
          name: "Laravel Exporter",
          image: imgIcon,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export to Laravel file"
        },
        {
          name: "SQL Exporter",
          image: imgIcon,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export to SQL file"
        },
        {
          name: "MongoDB Exporter",
          image: imgIcon,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export to MongoDB file"
        }
      ]}
      onClickItem={action("clicked")}
    />
  ))
  .add("with excerpt", () => (
    <PluginList
      items={[
        {
          name: "Laravel Exporter",
          image: imgIcon,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export scheme to Laravel model and migration"
        },
        {
          name: "SQL Exporter",
          image: imgIcon,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export scheme to SQL file"
        },
        {
          name: "MongoDB Exporter",
          image: imgIcon,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export scheme to MongoDB file"
        }
      ]}
      onClickItem={action("clicked")}
    />
  ))
  .add("with keyword", () => (
    <PluginList
      keyword="mongo"
      items={[
        {
          name: "Laravel Exporter",
          image: imgIcon,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export scheme to Laravel model and migration"
        },
        {
          name: "SQL Exporter",
          image: imgIcon,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export scheme to SQL file"
        },
        {
          name: "MongoDB Exporter",
          image: imgIcon,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export scheme to MongoDB file"
        }
      ]}
      onClickItem={action("clicked")}
    />
  ))
  .add("with active item", () => (
    <PluginList
      items={[
        {
          id: "1",
          name: "Laravel Exporter",
          image: imgIcon,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export scheme to Laravel model and migration"
        },
        {
          id: "2",
          name: "SQL Exporter",
          image: imgIcon,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export scheme to SQL file"
        },
        {
          id: "3",
          name: "MongoDB Exporter",
          image: imgIcon,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export scheme to MongoDB file"
        }
      ]}
      onClickItem={action("clicked")}
      active="2"
    />
  ))
  .add("without plugin", () => <PluginList />);
