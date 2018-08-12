import { SET_EXTENSIONS } from "../actions/extensions";

// Contains extension list.
const extensions = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_EXTENSIONS:
      return payload;

    default:
      return state;
  }
};

export default extensions;
