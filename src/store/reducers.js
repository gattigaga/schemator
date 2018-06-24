import MdInfo from "react-icons/lib/md/info";

import {
  SET_TABLES,
  CLEAR_TABLES,
  ADD_TABLE,
  REMOVE_TABLE,
  UPDATE_TABLE,
  SET_FIELDS,
  CLEAR_FIELDS,
  ADD_FIELD,
  REMOVE_FIELD,
  UPDATE_FIELD,
  SET_RELATIONS,
  CLEAR_RELATIONS,
  ADD_RELATION,
  REMOVE_RELATION,
  UPDATE_RELATION,
  SET_PROJECT,
  SET_ALERT
} from "./actions";

export const tables = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_TABLES:
      return payload;

    case CLEAR_TABLES:
      return [];

    case ADD_TABLE:
      return [...state, payload];

    case REMOVE_TABLE:
      return state.filter(item => item.id !== payload);

    case UPDATE_TABLE:
      return state.map(item => {
        if (item.id === payload.id) {
          return {
            ...item,
            ...payload.data
          };
        }

        return item;
      });

    default:
      return state;
  }
};

export const fields = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_FIELDS:
      return payload;

    case CLEAR_FIELDS:
      return [];

    case ADD_FIELD:
      return [...state, payload];

    case REMOVE_FIELD:
      return state.filter(item => item.id !== payload);

    case UPDATE_FIELD:
      return state.map(item => {
        if (item.id === payload.id) {
          return {
            ...item,
            ...payload.data
          };
        }

        return item;
      });

    default:
      return state;
  }
};

export const relations = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_RELATIONS:
      return payload;

    case CLEAR_RELATIONS:
      return [];

    case ADD_RELATION:
      return [...state, payload];

    case REMOVE_RELATION:
      return state.filter(item => item.id !== payload);

    case UPDATE_RELATION:
      return state.map(item => {
        if (item.id === payload.id) {
          return {
            ...item,
            ...payload.data
          };
        }

        return item;
      });

    default:
      return state;
  }
};

export const project = (state = null, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_PROJECT:
      return payload;

    default:
      return state;
  }
};

export const alert = (
  state = {
    isOpen: false,
    message: "My message",
    icon: MdInfo,
    iconColor: "black"
  },
  action
) => {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return {
        ...state,
        ...payload
      };

    default:
      return state;
  }
};
