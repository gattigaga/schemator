import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import "typeface-roboto";

import Plugin from "./Plugin";

const Container = styled.div`
  width: 240px;
  height: 100%;
  overflow-y: auto;
  background: #333;
`;

const EmptyText = styled.p`
  font-size: 12px;
  color: white;
  font-family: Roboto;
  text-align: center;
  padding: 16px;
  margin: 0px;
`;

const PluginList = ({ items, keyword, active, onClickItem }) => {
  const byName = item => item.name.match(new RegExp(keyword, "i"));
  const makeExcerpt = item => {
    const suffix = item.description.length > 22 ? "..." : "";
    const excerpt = item.description.slice(0, 22);
    const description = `${excerpt}${suffix}`;

    return { ...item, description };
  };
  const filteredItems = items.filter(byName).map(makeExcerpt);

  return (
    <Container>
      {filteredItems.length ? (
        filteredItems.map((item, index) => (
          <Plugin
            key={index}
            {...item}
            onClick={() => onClickItem(item)}
            isActive={active === item.id}
          />
        ))
      ) : (
        <EmptyText>No plugins found</EmptyText>
      )}
    </Container>
  );
};

PluginList.propTypes = {
  items: PropTypes.array,
  keyword: PropTypes.string,
  active: PropTypes.string,
  onClickItem: PropTypes.func
};

PluginList.defaultProps = {
  items: [],
  keyword: "",
  onClickItem: () => {}
};

export default PluginList;
