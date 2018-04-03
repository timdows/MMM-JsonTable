var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
	start: function () {
		console.log('MMM-JsonTable helper started...');
	},

	getJson: function (url) {
		var self = this;

		request({ url: url, method: 'GET' }, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				// Send the json data back with the url to distinguish it on the receiving part
				self.sendSocketNotification("MMM-JsonTable_JSON_RESULT", {url: url, data: json});
			}
		});

	},

	//Subclass socketNotificationReceived received.
	socketNotificationReceived: function (notification, url) {
		if (notification === "MMM-JsonTable_GET_JSON") {
			this.getJson(url);
		}
	}
});