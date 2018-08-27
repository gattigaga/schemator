import React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";

import Statusbar from "../Statusbar";

const Container = styled.div`
  width: 640px;
`;

storiesOf("Statusbar", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => (
    <Statusbar
      zoom={75}
      pluginName="Schemator Laravel"
      projectName="LaravelScheme"
    />
  ))
  .add("without opened project", () => <Statusbar />)
  .add("with modified project", () => (
    <Statusbar
      zoom={75}
      pluginName="Schemator Laravel"
      projectName="LaravelScheme"
      isProjectModified
    />
  ));
