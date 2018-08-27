import React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";

import RelationLines from "../RelationLines";

const Container = styled.svg`
  width: 320px;
  height: 320px;
  background: #333;
`;

const items = [
  // x1 < x2
  {
    x1: 32,
    y1: 32,
    x2: 128,
    y2: 128
  },
  // x1 > x2
  {
    x1: 240,
    y1: 32,
    x2: 160,
    y2: 128
  }
];

storiesOf("RelationLines", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => <RelationLines items={items} />);
