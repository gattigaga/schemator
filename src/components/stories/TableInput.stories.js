import React from "react";
import { storiesOf, action } from "@storybook/react";
import styled from "styled-components";

import TableInput from "../TableInput";

const Container = styled.div`
  width: 240px;
  background: #222;
`;

storiesOf("TableInput", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => (
    <TableInput
      name="username"
      type="STRING"
      onClickRemove={action("remove clicked")}
      onChangeName={action("name changed")}
      onChangeType={action("type changed")}
    />
  ))
  .add("with selection disabled", () => (
    <TableInput
      name="user_id"
      type="INTEGER"
      onClickRemove={action("remove clicked")}
      onChangeName={action("name changed")}
      onChangeType={action("type changed")}
    />
  ));
