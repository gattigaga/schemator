import { SET_PLUGINS } from "../actions/plugins";

// Contains plugin list.
const plugins = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_PLUGINS:
      return payload;

    default:
      return state;
  }
};

export default plugins;
