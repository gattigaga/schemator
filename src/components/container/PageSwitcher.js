import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import WorkArea from "./WorkArea";
import Plugins from "./Plugins";

export const PageSwitcher = ({ page }) => {
  switch (page) {
    case "workarea":
      return <WorkArea />;

    case "plugins":
      return <Plugins />;

    default:
      return <WorkArea />;
  }
};

PageSwitcher.propTypes = {
  page: PropTypes.string
};

const mapStateToProps = ({ page }) => ({ page });

export default connect(mapStateToProps)(PageSwitcher);
