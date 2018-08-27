import React from "react";
import { storiesOf, action } from "@storybook/react";
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
