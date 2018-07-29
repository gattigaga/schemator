import { combineReducers, createStore } from "redux";

import project from "./reducers/project";
import tables from "./reducers/tables";
import fields from "./reducers/fields";
import relations from "./reducers/relations";
import recentProjects from "./reducers/recentProjects";
import page from "./reducers/page";

const rootReducer = combineReducers({
  project,
  tables,
  fields,
  relations,
  recentProjects,
  page
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
