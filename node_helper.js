const NodeHelper = require("node_helper");
const Log = require("logger");

const fetch = (...args) =>
  // eslint-disable-next-line no-shadow
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = NodeHelper.create({
  start() {
    Log.log("MMM-JsonTable helper started...");
  },

  getJson(url) {
    const self = this;

    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        // Send the json data back with the url to distinguish it on the receiving part
        self.sendSocketNotification("MMM-JsonTable_JSON_RESULT", {
          url,
          data: json
        });
      });
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived(notification, url) {
    if (notification === "MMM-JsonTable_GET_JSON") {
      this.getJson(url);
    }
  }
});
