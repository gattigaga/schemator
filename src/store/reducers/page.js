import { SET_PAGE } from "../actions/page";

// Contains active page.
const page = (state = "workarea", action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_PAGE:
      return payload;

    default:
      return state;
  }
};

export default page;
