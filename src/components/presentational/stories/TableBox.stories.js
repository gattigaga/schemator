import React from "react";
import { storiesOf, action } from "@storybook/react";
import styled from "styled-components";

import TableBox from "../TableBox";

const Container = styled.svg`
  width: 640px;
  height: 480px;
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

storiesOf("TableBox", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => (
    <TableBox
      position={{ x: 32, y: 32 }}
      types={types}
      name="User"
      fields={[
        { id: "1", name: "fullname", type: "string" },
        { id: "2", name: "username", type: "string" }
      ]}
      options={[
        {
          id: "id",
          label: "ID",
          isChecked: true
        },
        {
          id: "rememberToken",
          label: "Remember Token",
          isChecked: false
        }
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
      onChangeOptions={action("options changed")}
      onContextMenu={action("context menu")}
    />
  ));
