import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { MdDashboard, MdDesktopMac } from "react-icons/lib/md";

import { setPage } from "../../store/actions/page";
import Sidebar from "../presentational/Sidebar";

export const SidebarContainer = ({ page, toPage }) => {
  const items = [
    {
      id: "workarea",
      icon: MdDesktopMac,
      tooltip: "Work Area"
    },
    {
      id: "extensions",
      icon: MdDashboard,
      tooltip: "Extensions"
    }
  ];

  return (
    <Sidebar
      items={items}
      onClickItem={item => toPage(item.id)}
      active={page}
    />
  );
};

SidebarContainer.propTypes = {
  page: PropTypes.string,
  toPage: PropTypes.func
};

export const mapStateToProps = ({ page }) => ({ page });

export const mapDispatchToProps = dispatch => ({
  toPage: pageID => dispatch(setPage(pageID))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidebarContainer);
