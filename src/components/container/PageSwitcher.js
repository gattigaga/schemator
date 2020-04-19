import React from "react";
import { useSelector } from "react-redux";

import WorkArea from "./WorkArea";
import Plugins from "./Plugins";

export const PageSwitcher = () => {
  const page = useSelector((state) => state.page);

  switch (page) {
    case "workarea":
      return <WorkArea />;

    case "plugins":
      return <Plugins />;

    default:
      return <WorkArea />;
  }
};

export default PageSwitcher;
