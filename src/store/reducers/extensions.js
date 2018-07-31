import { SET_EXTENSIONS } from "../actions/extensions";

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
