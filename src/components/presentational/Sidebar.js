import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Tool from "./Tool";

const Container = styled.div`
  height: 100%;
  width: 48px;
  background: #444;
`;

const Sidebar = ({ items, onClickItem }) => (
  <Container>
    {items.map((item, index) => (
      <Tool key={index} {...item} onClick={() => onClickItem(item)} />
    ))}
  </Container>
);

Sidebar.propTypes = {
  items: PropTypes.array,
  onClickItem: PropTypes.func
};

Sidebar.defaultProps = {
  items: [],
  onClickItem: () => {}
};

export default Sidebar;
