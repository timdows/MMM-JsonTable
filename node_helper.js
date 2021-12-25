let NodeHelper = require("node_helper");
let fetch = require("node-fetch");

module.exports = NodeHelper.create({
  start: function () {
    console.log("MMM-JsonTable helper started...");
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
