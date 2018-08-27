import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Statusbar from "../presentational/Statusbar";

export const StatusbarContainer = ({ project, plugin }) => {
  if (project) {
    return (
      <Statusbar
        zoom={project.zoom}
        pluginName={plugin.name}
        projectName={project.name}
        isProjectModified={project.isModified}
      />
    );
  }

  return <Statusbar />;
};

StatusbarContainer.propTypes = {
  project: PropTypes.object,
  plugin: PropTypes.object
};

export const mapStateToProps = ({ project, plugin }) => ({
  project,
  plugin
});

export default connect(mapStateToProps)(StatusbarContainer);
