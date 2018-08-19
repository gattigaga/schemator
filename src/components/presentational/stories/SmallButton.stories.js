import React from "react";
import { storiesOf, action } from "@storybook/react";

import SmallButton from "../SmallButton";

storiesOf("SmallButton", module)
  .add("default", () => (
    <SmallButton caption="Remove" onClick={action("clicked")} />
  ))
  .add("is disabled", () => (
    <SmallButton caption="Remove" onClick={action("clicked")} isDisabled />
  ));
