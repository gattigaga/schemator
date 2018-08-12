import {
  SET_RELATIONS,
  CLEAR_RELATIONS,
  ADD_RELATION,
  REMOVE_RELATION,
  UPDATE_RELATION
} from "../actions/relations";

// Contains relation list.
const relations = (state = [], action) => {
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

export default relations;
