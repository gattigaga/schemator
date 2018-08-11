import { SET_EXTENSION } from "../actions/extension";

const extension = (state = null, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_EXTENSION:
      return payload;

    default:
      return state;
  }
};

export default extension;
