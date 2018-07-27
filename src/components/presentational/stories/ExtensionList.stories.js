import React from "react";
import { storiesOf, action } from "@storybook/react";
import styled from "styled-components";

import imgScreenshot from "../../../../res/screenshot.png";
import ExtensionList from "../ExtensionList";

const Container = styled.div`
  width: 240px;
`;

storiesOf("ExtensionList", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => (
    <ExtensionList
      items={[
        {
          name: "Laravel Exporter",
          image: imgScreenshot,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export to Laravel file"
        },
        {
          name: "SQL Exporter",
          image: imgScreenshot,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export to SQL file"
        },
        {
          name: "MongoDB Exporter",
          image: imgScreenshot,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export to MongoDB file"
        }
      ]}
      onClickItem={action("clicked")}
    />
  ))
  .add("with excerpt", () => (
    <ExtensionList
      items={[
        {
          name: "Laravel Exporter",
          image: imgScreenshot,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export scheme to Laravel model and migration"
        },
        {
          name: "SQL Exporter",
          image: imgScreenshot,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export scheme to SQL file"
        },
        {
          name: "MongoDB Exporter",
          image: imgScreenshot,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export scheme to MongoDB file"
        }
      ]}
      onClickItem={action("clicked")}
    />
  ))
  .add("with keyword", () => (
    <ExtensionList
      keyword="mongo"
      items={[
        {
          name: "Laravel Exporter",
          image: imgScreenshot,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export scheme to Laravel model and migration"
        },
        {
          name: "SQL Exporter",
          image: imgScreenshot,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export scheme to SQL file"
        },
        {
          name: "MongoDB Exporter",
          image: imgScreenshot,
          author: "Gattigaga Hayyuta Dewa",
          description: "Export scheme to MongoDB file"
        }
      ]}
      onClickItem={action("clicked")}
    />
  ))
  .add("without extension", () => <ExtensionList />);
