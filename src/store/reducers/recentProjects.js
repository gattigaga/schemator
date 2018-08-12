import {
  SET_RECENT_PROJECTS,
  ADD_RECENT_PROJECT
} from "../actions/recentProjects";

// Contains recently opened project paths.
const recentProjects = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_RECENT_PROJECTS:
      return payload;

    case ADD_RECENT_PROJECT:
      return [payload, ...state];

    default:
      return state;
  }
};

export default recentProjects;
