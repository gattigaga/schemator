import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ExtensionList from "../presentational/ExtensionList";

export const ExtensionListContainer = ({ items, keyword }) => (
  <ExtensionList keyword={keyword} items={items} />
);

ExtensionListContainer.propTypes = {
  items: PropTypes.array,
  keyword: PropTypes.string
};

export const mapStateToProps = ({ extensions }) => ({ items: extensions });

export default connect(mapStateToProps)(ExtensionListContainer);
