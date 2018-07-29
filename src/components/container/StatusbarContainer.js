import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Statusbar from "../presentational/Statusbar";

export const StatusbarContainer = ({ project }) => {
  if (project) {
    const { zoom, name, isModified } = project;

    return (
      <Statusbar
        zoom={zoom}
        projectName={name}
        isProjectModified={isModified}
      />
    );
  }

  return <Statusbar />;
};

StatusbarContainer.propTypes = {
  project: PropTypes.object
};

export const mapStateToProps = ({ project }) => ({ project });

export default connect(mapStateToProps)(StatusbarContainer);
