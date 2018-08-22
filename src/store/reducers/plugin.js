import { SET_PLUGIN } from "../actions/plugin";

// Contains active plugin.
const plugin = (state = null, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_PLUGIN:
      return payload;

    default:
      return state;
  }
};

export default plugin;
