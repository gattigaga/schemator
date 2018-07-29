import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import WorkArea from "./WorkArea";
import Extensions from "./Extensions";

export const PageSwitcher = ({ page }) => {
  switch (page) {
    case "workarea":
      return <WorkArea />;

    case "extensions":
      return <Extensions />;

    default:
      return <WorkArea />;
  }
};

PageSwitcher.propTypes = {
  page: PropTypes.string
};

const mapStateToProps = ({ page }) => ({ page });

export default connect(mapStateToProps)(PageSwitcher);
