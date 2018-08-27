import React from "react";
import { storiesOf, action } from "@storybook/react";
import IconSave from "react-icons/lib/md/save";
import styled from "styled-components";

import Tool from "../Tool";

const Container = styled.div`
  width: 48px;
  height: 48px;
  background: #444;
`;

storiesOf("Tool", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => (
    <Tool icon={IconSave} tooltip="Save Schema" onClick={action("clicked")} />
  ))
  .add("is active", () => (
    <Tool
      icon={IconSave}
      tooltip="Save Schema"
      onClick={action("clicked")}
      isActive
    />
  ));
