import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import PluginList from "../presentational/PluginList";

export const PluginListContainer = ({
  items,
  keyword,
  active,
  onClickItem
}) => (
  <PluginList
    keyword={keyword}
    items={items}
    active={active}
    onClickItem={onClickItem}
  />
);

PluginListContainer.propTypes = {
  items: PropTypes.array,
  keyword: PropTypes.string,
  active: PropTypes.string,
  onClickItem: PropTypes.func
};

export const mapStateToProps = ({ plugins }) => ({ items: plugins });

export default connect(mapStateToProps)(PluginListContainer);
