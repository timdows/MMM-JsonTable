const NodeHelper = require("node_helper");
const Log = require("logger");

module.exports = NodeHelper.create({
  start () {
    Log.log("MMM-JsonTable helper started...");
  },

  getJson (payload) {
    const self = this;

    fetch(payload.url)
      .then((response) => response.json())
      .then((json) => {
        // Send the json data back with the url to distinguish it on the receiving part
        self.sendSocketNotification("MMM-JsonTable_JSON_RESULT", {
          id:payload.id,
          data: json
        });
      });
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived (notification, payload ) {
    if (notification === "MMM-JsonTable_GET_JSON") {
      this.getJson(payload);
    }
  }
});
