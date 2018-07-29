import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { MdZoomIn } from "react-icons/lib/md";

import "typeface-roboto";

const Container = styled.div`
  height: 24px;
  width: 100%;
  background: #b33939;
  display: flex;
  align-items: center;
  padding: 0px 12px;
  box-sizing: border-box;
`;

const ZoomWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const Text = styled.p`
  color: white;
  font-size: 12px;
  font-family: Roboto;
  margin: 0px;
`;

const Icon = styled(MdZoomIn)`
  color: white;
  font-size: 14px;
  margin-right: 4px;
`;

const Statusbar = ({ projectName, zoom, isProjectModified }) => (
  <Container>
    {projectName && (
      <Text>
        {projectName}
        {isProjectModified && " (Unsaved)"}
      </Text>
    )}
    <ZoomWrapper>
      <Icon />
      <Text>{zoom}%</Text>
    </ZoomWrapper>
  </Container>
);

Statusbar.propTypes = {
  projectName: PropTypes.string,
  zoom: PropTypes.number,
  isProjectModified: PropTypes.bool
};

Statusbar.defaultProps = {
  zoom: 100
};

export default Statusbar;
