import { SET_PROJECT, UPDATE_PROJECT, CLEAR_PROJECT } from "../actions/project";

// Contains currently opened project.
const project = (state = null, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_PROJECT:
      return payload;

    case UPDATE_PROJECT:
      return {
        ...(state || {}),
        ...payload
      };

    case CLEAR_PROJECT:
      return null;

    default:
      return state;
  }
};

export default project;
