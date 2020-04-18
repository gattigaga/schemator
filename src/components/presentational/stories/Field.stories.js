import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";

import Field from "../Field";

const Container = styled.div`
  width: 240px;
  background: #222;
`;

const types = [
  {
    id: "string",
    label: "String"
  },
  {
    id: "boolean",
    label: "Boolean"
  },
  {
    id: "char",
    label: "Char"
  }
];

storiesOf("Field", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => (
    <Field
      name="username"
      type="string"
      types={types}
      onClickRemove={action("remove clicked")}
      onChangeName={action("name changed")}
      onChangeType={action("type changed")}
    />
  ))
  .add("with selection disabled", () => (
    <Field
      name="username"
      type="string"
      types={types}
      onClickRemove={action("remove clicked")}
      onChangeName={action("name changed")}
      onChangeType={action("type changed")}
      isTypeDisabled
    />
  ));
