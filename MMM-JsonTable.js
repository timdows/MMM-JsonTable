/* global Module moment */

Module.register("MMM-JsonTable", {
  jsonData: null,

  // Default module config.
  defaults: {
    url: "",
    arrayName: null,
    arrayName2: null,
    noDataText:
      "Json data is not of type array! Maybe the config arrayName is not used and should be, or is configured wrong.",
    keepColumns: [],
    size: 0,
    tryFormatDate: false,
    updateInterval: 15000,
    animationSpeed: 500,
    descriptiveRow: null
  },

  start() {
    this.getJson();
    this.scheduleUpdate();
  },

  scheduleUpdate() {
    const self = this;
    setInterval(() => {
      self.getJson();
    }, this.config.updateInterval);
  },

  // Request node_helper to get json from url
  getJson() {
    this.sendSocketNotification("MMM-JsonTable_GET_JSON", this.config.url);
  },

  socketNotificationReceived(notification, payload) {
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
  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "xsmall";

    if (!this.jsonData) {
      wrapper.innerHTML = "Awaiting json data...";
      return wrapper;
    }

    const table = document.createElement("table");
    const tbody = document.createElement("tbody");

    let items = [];
    if (this.config.arrayName) {
      items = this.jsonData[this.config.arrayName][this.config.arrayName2];
    } else {
      items = this.jsonData;
    }

    // Check if items is of type array
    if (!(items instanceof Array)) {
      wrapper.innerHTML = this.config.noDataText;
      return wrapper;
    }

    items.forEach((element) => {
      const row = this.getTableRow(element);
      tbody.appendChild(row);
    });

    // Add in Descriptive Row Header
    if (this.config.descriptiveRow) {
      const header = table.createTHead();
      header.innerHTML = this.config.descriptiveRow;
    }

    table.appendChild(tbody);
    wrapper.appendChild(table);
    return wrapper;
  },

  getTableRow(jsonObject) {
    const row = document.createElement("tr");
    Object.entries(jsonObject).forEach(([key, value]) => {
      const cell = document.createElement("td");

      let valueToDisplay = "";
      if (key === "icon") {
        cell.classList.add("fa", value);
      } else if (this.config.tryFormatDate) {
        valueToDisplay = this.getFormattedValue(value);
      } else if (
        this.config.keepColumns.length === 0 ||
        this.config.keepColumns.indexOf(key) >= 0
      ) {
        valueToDisplay = value;
      }

      const cellText = document.createTextNode(valueToDisplay);

      if (this.config.size > 0 && this.config.size < 9) {
        const h = document.createElement(`H${this.config.size}`);
        h.appendChild(cellText);
        cell.appendChild(h);
      } else {
        cell.appendChild(cellText);
      }

      row.appendChild(cell);
    });
    return row;
  },

  // Format a date string or return the input
  getFormattedValue(input) {
    const m = moment(input);
    if (typeof input === "string" && m.isValid()) {
      // Show a formatted time if it occures today
      if (
        m.isSame(new Date(), "day") &&
        m.hours() !== 0 &&
        m.minutes() !== 0 &&
        m.seconds() !== 0
      ) {
        return m.format("HH:mm:ss");
      }
      return m.format("YYYY-MM-DD");
    }
    return input;
  }
});
