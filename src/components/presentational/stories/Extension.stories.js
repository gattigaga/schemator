import React from "react";
import { storiesOf, action } from "@storybook/react";
import styled from "styled-components";

import imgIcon from "../../../assets/images/icon-black.png";
import Extension from "../Extension";

const Container = styled.div`
  width: 240px;
`;

storiesOf("Extension", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => (
    <Extension
      image={imgIcon}
      name="Schema"
      author="Gattigaga Hayyuta Dewa"
      description="Create schema in one screen."
      onClick={action("clicked")}
    />
  ))
  .add("is active", () => (
    <Extension
      image={imgIcon}
      name="Schema"
      author="Gattigaga Hayyuta Dewa"
      description="Create schema in one screen."
      onClick={action("clicked")}
      isActive
    />
  ));
