import React from "react";
import { storiesOf, action } from "@storybook/react";
import IconSave from "react-icons/lib/md/save";
import styled from "styled-components";

import Tool from "../Tool";

const Container = styled.div`
  margin-left: 32px;
`;

storiesOf("Tool", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => (
    <Tool icon={IconSave} tooltip="Save Schema" onClick={action("clicked")} />
  ))
  .add("is disabled", () => (
    <Tool
      icon={IconSave}
      tooltip="Save Schema"
      onClick={action("clicked")}
      isDisabled
    />
  ));
