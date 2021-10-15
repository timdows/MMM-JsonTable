var NodeHelper = require('node_helper');
var fetch = require('node-fetch');

module.exports = NodeHelper.create({
	start: function () {
		console.log('MMM-BTCFees helper started...');
	},

	getJson: function (url) {
		var self = this;

		fetch(url).then(response => response.json()).then(json => {
			// Send the json data back with the url to distinguish it on the receiving part
			self.sendSocketNotification("MMM-BTCFees_JSON_RESULT", {url: url, data: json});
		});

	},

	//Subclass socketNotificationReceived received.
	socketNotificationReceived: function (notification, url) {
		if (notification === "MMM-BTCFees_GET_JSON") {
			this.getJson(url);
		}
	}
});