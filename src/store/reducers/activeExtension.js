import { SET_ACTIVE_EXTENSION } from "../actions/activeExtension";

const extension = (state = null, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_ACTIVE_EXTENSION:
      return payload;

    default:
      return state;
  }
};

export default extension;
