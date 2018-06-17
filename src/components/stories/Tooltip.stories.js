import React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";

import Tooltip from "../Tooltip";

const Container = styled.div`
  width: 32px;
  height: 32px;
  position: relative;
  border: 1px solid #aaa;
  margin-left: 32px;
`;

const StyledTooltip = styled(Tooltip)`
  opacity: 1;
`;

storiesOf("Tooltip", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => <StyledTooltip text="Open Content" />);
