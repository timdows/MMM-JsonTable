'use strict';

Module.register("MMM-BTCFees", {

	jsonData: "",
	btcData: 0,

	// Default module config.
	defaults: {
		url: "https://mempool.space/api/v1/fees/recommended",
		urlBtc: "https://api.cryptonator.com/api/ticker/btc-usd",
		arrayName: null,
		keepColumns: [],
		size: 0,
		tryFormatDate: false,
		updateInterval: 15000,
		descriptiveRow: null
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

	// Request node_helper to get json from url
	getJson: function () {
		this.sendSocketNotification("MMM-BTCFees_GET_JSON", this.config.url);
	},

	getBtc: function () {
		this.sendSocketNotification("MMM-BTCFees_GET_BTC", this.config.urlBtc);
	},
	btcToUsd: function (value) {
		var price= 0;
		price = (value*getBtc(urlBtc)).toFixed(2);
		return price;
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "MMM-BTCFees_JSON_RESULT") {
			// Only continue if the notification came from the request we made
			// This way we can load the module more than once
			if (payload.url === this.config.url)
			{
				this.jsonData = payload.data;
				this.updateDom(500);
			}
		}
	},
	socketNotificationBtcReceived: function (notification, payload) {
		if (notification === "MMM-BTCFees_BTC_RESULT") {
			// Only continue if the notification came from the request we made
			// This way we can load the module more than once
			if (payload.url === this.config.urlBtc)
			{
				this.btcData = payload.data;
				this.updateDom(500);
			}
		}
	},

	// Override dom generator.
	getDom: function () {
		var wrapper = document.createElement("div");
		wrapper.className = "xsmall";

		if (!this.jsonData) {
			wrapper.innerHTML = "Awaiting json data...";
			return wrapper;
		}
		
		var table = document.createElement("table");
		var tbody = document.createElement("tbody");
		
		var items = [];
		if (this.config.arrayName) {
			items = this.jsonData[this.config.arrayName];
		}
		else {
			items = this.jsonData;
		}

		// Check if items is of type array
		if (!(items instanceof Array)) {
			wrapper.innerHTML = "Json data is not of type array! " +
				"Maybe the config arrayName is not used and should be, or is configured wrong";
			return wrapper;
		}

		items.forEach(element => {
			var row = this.getTableRow(element);
			tbody.appendChild(row);
		});
		
		// Add in Descriptive Row Header
		if (this.config.descriptiveRow) {
			var header = table.createTHead();
			header.innerHTML = this.config.descriptiveRow;
		}

		table.appendChild(tbody);
		wrapper.appendChild(table);
		return wrapper;
	},

	getTableRow: function (jsonObject) {
		var row = document.createElement("tr");
		for (var key in jsonObject) {
			var cell = document.createElement("td");
			var cell2 = document.createElement("td");
			
			var valueToDisplay = "";
			var nameToDisplay = "";
			if (key === "icon") {
				cell.classList.add("fa", jsonObject[key]);
			}
			else if (this.config.tryFormatDate) {
				valueToDisplay = this.getFormattedValue(jsonObject[key]);
			}
			else {
				if ( this.config.keepColumns.length == 0 || this.config.keepColumns.indexOf(key) >= 0 ){
					valueToDisplay = jsonObject[key];
					nameToDisplay = key;

				}
			}

			var cellText = document.createTextNode(valueToDisplay);
			var cellName = document.createTextNode(nameToDisplay);
			var cellUsd = document.createTextNode(valueToDisplay);//test without function
			//var cellUsd = document.createTextNode(btcToUsd(valueToDisplay));

			if ( this.config.size > 0 && this.config.size < 9 ){
				var h = document.createElement("H" + this.config.size );
				h.appendChild(cellText)
				var h2 = document.createElement("H" + this.config.size );
				h2.appendChild(cellName)
				var h3 = document.createElement("H" + this.config.size );
				h3.appendChild(cellUsd)
				cell.appendChild(h);
				cell2.appendChild(h2);
				cell3.appendChild(h3);
			}
			else
			{
				cell.appendChild(cellText);
				cell2.appendChild(cellName);
				cell3.appendChild(cellUsd);
			}

			row.appendChild(cell2);
			row.appendChild(cell);
			row.appendChild(cell3);
		}
		return row;
	},


	//get BTC price
	getBtcValueInUsd: function (input) {
		var m = moment(input);
		if (typeof input === "number" && m.isValid()) {
			// Show a formatted time if it occures today
			if (m.isSame(new Date(), "day") && m.hours() !== 0 && m.minutes() !== 0 && m.seconds() !== 0) {
				return m.format("HH:mm:ss");
			}
			else {
				return m.format("YYYY-MM-DD");
			}
		}
		else {
			return input;
		}
	}

});
