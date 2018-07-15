import React from "react";
import { storiesOf, action } from "@storybook/react";
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
