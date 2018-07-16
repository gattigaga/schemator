import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";

import {
  clearTables,
  clearFields,
  clearRelations,
  clearProject
} from "./store/actions";
import Toolbar from "./components/container/Toolbar";
import WorkArea from "./components/container/WorkArea";

const { remote } = window.require("electron");

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.menu = null;
  }

  componentDidMount() {
    this.createMenu();
  }

  componentWillReceiveProps(nextProps) {
    const { Menu } = remote;
    const { project } = this.props;
    const isProjectInitializedOrClosed = !nextProps.project || !project;
    const isProjectChanged =
      !!project &&
      !!nextProps.project &&
      nextProps.project.name !== project.name;

    if (isProjectInitializedOrClosed || isProjectChanged) {
      const closeProjectMenu = this.menu.getMenuItemById("close-project");

      closeProjectMenu.enabled = !!nextProps.project;
      Menu.setApplicationMenu(this.menu);
    }
  }

  /**
   * Create menubar
   *
   * @memberof App
   */
  createMenu() {
    const {
      project,
      removeProject,
      removeAllTables,
      removeAllFields,
      removeAllRelations
    } = this.props;
    const { Menu } = remote;

    const template = [
      {
        id: "file",
        label: "File",
        submenu: [
          {
            id: "close-project",
            label: "Close Project",
            enabled: !!project,
            click() {
              removeProject();
              removeAllTables();
              removeAllFields();
              removeAllRelations();
            }
          },
          {
            type: "separator"
          },
          {
            id: "exit",
            label: "Exit",
            click() {
              remote.getCurrentWindow().close();
            }
          }
        ]
      },
      {
        label: "View",
        submenu: [
          { role: "reload" },
          { role: "forcereload" },
          { role: "toggledevtools" }
        ]
      }
    ];

    this.menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(this.menu);
  }

  render() {
    const { project } = this.props;

    return (
      <Container>
        {project && (
          <Helmet>
            <title>
              Schemator {project.name ? `- ${project.name}` : ""}{" "}
              {project.isModified ? "- Modified" : ""}
            </title>
          </Helmet>
        )}
        <Toolbar />
        <WorkArea />
      </Container>
    );
  }
}

App.propTypes = {
  project: PropTypes.object,
  removeProject: PropTypes.func,
  removeAllTables: PropTypes.func,
  removeAllFields: PropTypes.func,
  removeAllRelations: PropTypes.func
};

const mapStateToProps = ({ project }) => ({ project });

const mapDispatchToProps = dispatch => ({
  removeProject: () => dispatch(clearProject()),
  removeAllTables: () => dispatch(clearTables()),
  removeAllFields: () => dispatch(clearFields()),
  removeAllRelations: () => dispatch(clearRelations())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
