import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";

import TableButton from "../TableButton";

const Container = styled.div`
  width: 240px;
`;

storiesOf("TableButton", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => (
    <TableButton caption="Add New Field" onClick={action("clicked")} />
  ));
