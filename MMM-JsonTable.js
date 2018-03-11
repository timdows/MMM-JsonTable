'use strict';

Module.register("MMM-JsonTable", {

	// Default module config.
	defaults: {
		text: "Hello World!",
		url: "",
		updateInterval: 15000
	},

	start: function () {
		this.getJson();
		this.scheduleUpdate();
	},

	scheduleUpdate: function () {
		var self = this;
		setInterval(function () {
			self.getJson();
		}, this.config.updateInterval);
	},

	getJson: function () {
		this.sendSocketNotification('GET_JSON', this.config.url);
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "JSON_RESULT") {
			console.log(payload);
		}
	},

	// Override dom generator.
	getDom: function () {
		var wrapper = document.createElement("div");
		wrapper.innerHTML = this.config.text;
		return wrapper;
	}

});