import React from "react";
import { storiesOf, action } from "@storybook/react";
import styled from "styled-components";

import imgIcon from "../../../assets/images/icon-black.png";
import Plugin from "../Plugin";

const Container = styled.div`
  width: 240px;
`;

storiesOf("Plugin", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => (
    <Plugin
      image={imgIcon}
      name="Schema"
      author="Gattigaga Hayyuta Dewa"
      description="Create schema in one screen."
      onClick={action("clicked")}
    />
  ))
  .add("is active", () => (
    <Plugin
      image={imgIcon}
      name="Schema"
      author="Gattigaga Hayyuta Dewa"
      description="Create schema in one screen."
      onClick={action("clicked")}
      isActive
    />
  ));
