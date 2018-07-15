import React from "react";
import { storiesOf, action } from "@storybook/react";
import styled from "styled-components";
import MdInfo from "react-icons/lib/md/info";

import Alert from "../Alert";

const Container = styled.div`
  width: 240px;
`;

storiesOf("Alert", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => (
    <Alert
      icon={MdInfo}
      iconColor="black"
      message="My message"
      onClickOK={action("clicked")}
      onRequestClose={action("closed")}
      isOpen
    />
  ));
