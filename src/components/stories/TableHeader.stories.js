import React from "react";
import { storiesOf, action } from "@storybook/react";
import styled from "styled-components";

import TableHeader from "../TableHeader";

const Container = styled.div`
  width: 240px;
`;

storiesOf("TableHeader", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => (
    <TableHeader caption="User" onChangeCaption={action("caption changed")} />
  ));
