import React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";

import BGLines from "../BGLines";

const Container = styled.svg`
  width: 128px;
  height: 128px;
  background: #333;
`;

storiesOf("BGLines", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => (
    <BGLines totalHorizontal={3} totalVertical={3} gap={32} />
  ));
