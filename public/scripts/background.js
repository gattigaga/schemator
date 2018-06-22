/* global chrome */

chrome.app.runtime.onLaunched.addListener(() => {
  chrome.app.window.create("index.html", {
    id: "main",
    innerBounds: {
      width: 800,
      height: 600
    },
    state: "maximized",
    resizable: false
  });
});
