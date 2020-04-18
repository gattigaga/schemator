import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import SmallButton from "../SmallButton";

storiesOf("SmallButton", module)
  .add("default", () => (
    <SmallButton caption="Remove" onClick={action("clicked")} />
  ))
  .add("is disabled", () => (
    <SmallButton caption="Remove" onClick={action("clicked")} isDisabled />
  ));
