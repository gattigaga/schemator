import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Tool from "./Tool";

const Container = styled.div`
  height: 100%;
  width: 48px;
  background: #444;
`;

const Sidebar = ({ items, onClickItem, active }) => (
  <Container>
    {items.map((item, index) => (
      <Tool
        key={index}
        {...item}
        onClick={() => onClickItem(item)}
        isActive={item.id === active}
      />
    ))}
  </Container>
);

Sidebar.propTypes = {
  items: PropTypes.array,
  onClickItem: PropTypes.func,
  active: PropTypes.string
};

Sidebar.defaultProps = {
  items: [],
  onClickItem: () => {}
};

export default Sidebar;
