const NodeHelper = require("node_helper");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const Log = require("logger");

module.exports = NodeHelper.create({
  start: function () {
    Log.log("MMM-JsonTable helper started...");
  },

  getJson: function (url) {
    let self = this;

    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        // Send the json data back with the url to distinguish it on the receiving part
        self.sendSocketNotification("MMM-JsonTable_JSON_RESULT", {
          url: url,
          data: json
        });
      });
  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function (notification, url) {
    if (notification === "MMM-JsonTable_GET_JSON") {
      this.getJson(url);
    }
  }
});
