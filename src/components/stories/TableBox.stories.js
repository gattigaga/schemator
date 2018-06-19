import React from "react";
import { storiesOf, action } from "@storybook/react";
import styled from "styled-components";

import TableBox from "../TableBox";

const Container = styled.svg`
  width: 640px;
  height: 480px;
`;

storiesOf("TableBox", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => (
    <TableBox
      position={{ x: 32, y: 32 }}
      name="User"
      fields={[
        { id: "1", name: "id", type: "INCREMENT" },
        { id: "2", name: "username", type: "VARCHAR" }
      ]}
      onMouseDown={action("mouse down")}
      onMouseMove={action("mouse move")}
      onClickAddField={action("add field clicked")}
      onClickRemoveField={action("remove field clicked")}
      onChangeFieldName={action("field name changed")}
      onChangeFieldType={action("field type changed")}
      onChangeName={action("name changed")}
    />
  ));
