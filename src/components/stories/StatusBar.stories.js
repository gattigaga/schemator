import React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";

import StatusBar from "../StatusBar";

const Container = styled.div`
  width: 640px;
`;

storiesOf("StatusBar", module)
  .addDecorator((story) => <Container>{story()}</Container>)
  .add("default", () => (
    <StatusBar
      zoom={75}
      pluginName="Schemator Laravel"
      projectName="LaravelScheme"
    />
  ))
  .add("without opened project", () => <StatusBar />)
  .add("with modified project", () => (
    <StatusBar
      zoom={75}
      pluginName="Schemator Laravel"
      projectName="LaravelScheme"
      isProjectModified
    />
  ));
