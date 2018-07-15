import React from "react";
import { storiesOf, action } from "@storybook/react";
import styled from "styled-components";

import ToolZoom from "../ToolZoom";

const Container = styled.div`
  margin-left: 32px;
`;

storiesOf("ToolZoom", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => (
    <ToolZoom value={25} tooltip="Zoom" onChange={action("changed")} />
  ))
  .add("is disabled", () => (
    <ToolZoom
      value={25}
      tooltip="Zoom"
      onChange={action("changed")}
      isDisabled
    />
  ));
