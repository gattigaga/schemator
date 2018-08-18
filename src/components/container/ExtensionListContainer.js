import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ExtensionList from "../presentational/ExtensionList";

export const ExtensionListContainer = ({
  items,
  keyword,
  active,
  onClickItem
}) => (
  <ExtensionList
    keyword={keyword}
    items={items}
    active={active}
    onClickItem={onClickItem}
  />
);

ExtensionListContainer.propTypes = {
  items: PropTypes.array,
  keyword: PropTypes.string,
  active: PropTypes.string,
  onClickItem: PropTypes.func
};

export const mapStateToProps = ({ extensions }) => ({ items: extensions });

export default connect(mapStateToProps)(ExtensionListContainer);
