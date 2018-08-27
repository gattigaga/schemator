import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import store from "./store/store";

import "normalize.css";

// eslint-disable-next-line
window.eval = global.eval = function() {
  throw new Error(`Sorry, this app does not support window.eval().`);
};

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
