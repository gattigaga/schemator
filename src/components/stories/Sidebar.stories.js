import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { MdDesktopMac, MdDashboard } from "react-icons/lib/md";
import styled from "styled-components";

import Sidebar from "../Sidebar";

const Container = styled.div`
  width: 48px;
  height: 320px;
  background: #444;
`;

storiesOf("Sidebar", module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add("default", () => (
    <Sidebar
      items={[
        {
          id: "workstage",
          icon: MdDesktopMac,
          tooltip: "Workstage"
        },
        {
          id: "extensions",
          icon: MdDashboard,
          tooltip: "Extensions"
        }
      ]}
      onClickItem={action("item clicked")}
    />
  ))
  .add("with active item", () => (
    <Sidebar
      items={[
        {
          id: "workstage",
          icon: MdDesktopMac,
          tooltip: "Workstage"
        },
        {
          id: "extensions",
          icon: MdDashboard,
          tooltip: "Extensions"
        }
      ]}
      onClickItem={action("item clicked")}
      active="extensions"
    />
  ));
