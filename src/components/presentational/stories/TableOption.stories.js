import React from "react";
import { storiesOf, action } from "@storybook/react";
import styled from "styled-components";

import TableOption from "../TableOption";

const Container = styled.div`
  width: 240px;
`;

storiesOf("TableOption", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => (
    <TableOption
      onChange={action("changed")}
      items={[
        { id: "id", label: "ID", isChecked: true },
        { id: "rememberToken", label: "Remember Token", isChecked: false }
      ]}
    />
  ));
