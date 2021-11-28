'use strict';

Module.register("MMM-JsonTable", {

  jsonData: null,

  // Default module config.
  defaults: {
    url: "",
    arrayName: null,
    noDataText: "Json data is not of type array! Maybe the config arrayName is not used and should be, or is configured wrong.",
    keepColumns: [],
    size: 0,
    tryFormatDate: false,
    updateInterval: 15000,
    animationSpeed: 500,
    descriptiveRow: null
  },

  start: function () {
    this.getJson();
    this.scheduleUpdate();
  },

  scheduleUpdate: function () {
    let self = this;
    setInterval(function () {
      self.getJson();
    }, this.config.updateInterval);
  },

  // Request node_helper to get json from url
  getJson: function () {
    this.sendSocketNotification("MMM-JsonTable_GET_JSON", this.config.url);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "MMM-JsonTable_JSON_RESULT") {
      // Only continue if the notification came from the request we made
      // This way we can load the module more than once
      if (payload.url === this.config.url) {
        this.jsonData = payload.data;
        this.updateDom(this.config.animationSpeed);
      }
    }
  },

  // Override dom generator.
  getDom: function () {
    let wrapper = document.createElement("div");
    wrapper.className = "xsmall";

    if (!this.jsonData) {
      wrapper.innerHTML = "Awaiting json data...";
      return wrapper;
    }

    let table = document.createElement("table");
    let tbody = document.createElement("tbody");

    let items = [];
    if (this.config.arrayName) {
      items = this.jsonData[this.config.arrayName];
    }
    else {
      items = this.jsonData;
    }

    // Check if items is of type array
    if (!(items instanceof Array)) {
      wrapper.innerHTML = this.config.noDataText;
      return wrapper;
    }

    items.forEach(element => {
      let row = this.getTableRow(element);
      tbody.appendChild(row);
    });

    // Add in Descriptive Row Header
    if (this.config.descriptiveRow) {
      let header = table.createTHead();
      header.innerHTML = this.config.descriptiveRow;
    }

    table.appendChild(tbody);
    wrapper.appendChild(table);
    return wrapper;
  },

  getTableRow: function (jsonObject) {
    let row = document.createElement("tr");
    for (let key in jsonObject) {
      let cell = document.createElement("td");

      let valueToDisplay = "";
      if (key === "icon") {
        cell.classList.add("fa", jsonObject[key]);
      }
      else if (this.config.tryFormatDate) {
        valueToDisplay = this.getFormattedValue(jsonObject[key]);
      }
      else {
        if (this.config.keepColumns.length == 0 || this.config.keepColumns.indexOf(key) >= 0) {
          valueToDisplay = jsonObject[key];
        }
      }

      let cellText = document.createTextNode(valueToDisplay);

      if (this.config.size > 0 && this.config.size < 9) {
        let h = document.createElement("H" + this.config.size);
        h.appendChild(cellText)
        cell.appendChild(h);
      }
      else {
        cell.appendChild(cellText);
      }

      row.appendChild(cell);
    }
    return row;
  },

  // Format a date string or return the input
  getFormattedValue: function (input) {
    let m = moment(input);
    if (typeof input === "string" && m.isValid()) {
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
