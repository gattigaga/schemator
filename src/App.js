import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";

import Toolbar from "./components/Toolbar";
import WorkArea from "./components/WorkArea";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

class App extends Component {
  render() {
    const { project } = this.props;

    return (
      <Container>
        {project && (
          <Helmet>
            <title>Schemator - {project.name}</title>
          </Helmet>
        )}
        <Toolbar />
        <WorkArea />
      </Container>
    );
  }
}

App.propTypes = {
  project: PropTypes.object
};

const mapStateToProps = ({ project }) => ({ project });

export default connect(mapStateToProps)(App);
