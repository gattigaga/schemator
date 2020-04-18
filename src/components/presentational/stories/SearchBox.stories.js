import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";

import SearchBox from "../SearchBox";

const Container = styled.div`
  width: 240px;
`;

storiesOf("SearchBox", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => (
    <SearchBox value="Laravel" onChange={action("changed")} />
  ));
