import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";

import Table from "../Table";

const Container = styled.svg`
  width: 640px;
  height: 480px;
  background: #333;
`;

const types = [
  {
    id: "string",
    label: "String",
  },
  {
    id: "boolean",
    label: "Boolean",
  },
  {
    id: "char",
    label: "Char",
  },
];

storiesOf("Table", module)
  .addDecorator((story) => <Container>{story()}</Container>)
  .add("default", () => (
    <Table
      position={{ x: 32, y: 32 }}
      types={types}
      name="User"
      fields={[
        { id: "1", name: "fullname", type: "string" },
        { id: "2", name: "username", type: "string" },
      ]}
      onMouseUp={action("mouse up")}
      onMouseDown={action("mouse down")}
      onMouseMove={action("mouse move")}
      onMouseEnter={action("mouse enter")}
      onMouseLeave={action("mouse leave")}
      onClickAddField={action("add field clicked")}
      onClickRemoveField={action("remove field clicked")}
      onChangeFieldName={action("field name changed")}
      onChangeFieldType={action("field type changed")}
      onChangeName={action("name changed")}
      onContextMenu={action("context menu")}
    />
  ))
  .add("is active", () => (
    <Table
      position={{ x: 32, y: 32 }}
      types={types}
      name="User"
      fields={[
        { id: "1", name: "fullname", type: "string" },
        { id: "2", name: "username", type: "string" },
      ]}
      onMouseUp={action("mouse up")}
      onMouseDown={action("mouse down")}
      onMouseMove={action("mouse move")}
      onMouseEnter={action("mouse enter")}
      onMouseLeave={action("mouse leave")}
      onClickAddField={action("add field clicked")}
      onClickRemoveField={action("remove field clicked")}
      onChangeFieldName={action("field name changed")}
      onChangeFieldType={action("field type changed")}
      onChangeName={action("name changed")}
      onContextMenu={action("context menu")}
      isActive
    />
  ));
