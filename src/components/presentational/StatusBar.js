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

const LeftWrapper = styled.div`
  display: flex;
`;

const Text = styled.p`
  color: white;
  font-size: 12px;
  font-family: Roboto;
  margin: 0px;
`;

const LeftText = styled(Text)`
  margin-right: 24px;
`;

const Icon = styled(MdZoomIn)`
  color: white;
  font-size: 14px;
  margin-right: 4px;
`;

const StatusBar = ({ pluginName, projectName, zoom, isProjectModified }) => (
  <Container>
    {projectName && (
      <LeftWrapper>
        <LeftText>Plugin: {pluginName}</LeftText>
        <LeftText>
          Project: {projectName}
          {isProjectModified && " (Unsaved)"}
        </LeftText>
      </LeftWrapper>
    )}
    <ZoomWrapper>
      <Icon />
      <Text>{zoom}%</Text>
    </ZoomWrapper>
  </Container>
);

StatusBar.propTypes = {
  pluginName: PropTypes.string,
  projectName: PropTypes.string,
  zoom: PropTypes.number,
  isProjectModified: PropTypes.bool,
};

StatusBar.defaultProps = {
  zoom: 100,
};

export default StatusBar;
