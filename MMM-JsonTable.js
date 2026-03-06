/* global Module moment */

Module.register("MMM-JsonTable", {
  jsonData: null,
  defaults: {
    url: "",
    arrayName: null,
    noDataText:
      "Json data is not of type array! Maybe the config arrayName is not used and should be, or is configured wrong.",
    keepColumns: [],
    size: 0,
    tryFormatDate: false,
    updateInterval: 15000,
    animationSpeed: 500,
    descriptiveRow: null,
    httpTimeout: 15000,
    requestHeaders: {},
    tlsInsecure: false,
    maxRedirects: 3
  },
  start () {
    this.getJson();
    this.scheduleUpdate();
  },
  scheduleUpdate () {
    const self = this;
    setInterval(() => {
      self.getJson();
    }, this.config.updateInterval);
  },
  getJson () {
    const options = {
      timeout: this.config.httpTimeout,
      headers: this.config.requestHeaders,
      tlsInsecure: this.config.tlsInsecure,
      maxRedirects: this.config.maxRedirects
    };
    const payload = {id: this.identifier,
      url: this.config.url,
      options};
    this.sendSocketNotification("MMM-JsonTable_GET_JSON", payload);
  },
  socketNotificationReceived (notification, payload) {
    if (notification === "MMM-JsonTable_JSON_RESULT") {
      const isMine = payload && payload.id === this.identifier || payload && payload.url === this.config.url;
      if (isMine) {
        this.jsonData = payload.data;
        this.updateDom(this.config.animationSpeed);
      }
      return;
    }
    if (notification === "MMM-JsonTable_JSON_ERROR") {
      const isMineError = payload && payload.id === this.identifier || payload && payload.url === this.config.url;
      if (isMineError) {
        this.jsonData = null;
        this.updateDom(this.config.animationSpeed);
      }
    }
  },
  normalizePathToParts (rawPathInput) {
    const raw = String(rawPathInput);
    const normalizedBracket = raw.replace(/\[(?<index>\d+)\]/gu, ".$<index>");
    const normalized = normalizedBracket.replace(/^\./u, "");
    return normalized.split(".");
  },
  resolvePath (data, pathStr) {
    try {
      if (data === null || typeof data === "undefined") {
        return null;
      }
      if (!pathStr) {
        return data;
      }
      const parts = this.normalizePathToParts(pathStr);
      let node = data;
      for (let idx = 0; idx < parts.length; idx += 1) {
        const raw = parts[idx];
        let key = raw;
        if ((/^\d+$/u).test(raw)) {
          key = Number(raw);
        }
        if (node === null || typeof node === "undefined" || !(key in node)) {
          return null;
        }
        node = node[key];
      }
      return node;
    } catch {
      return null;
    }
  },
  unwrapSingleNestedArray (arr) {
    if (Array.isArray(arr) && arr.length === 1 && Array.isArray(arr[0])) {
      return arr[0];
    }
    return arr;
  },
  resolveArrayWithFallbacks (root, paths) {
    let list = [];
    if (Array.isArray(paths)) {
      list = paths;
    } else if (paths) {
      list = [paths];
    }
    for (let idx = 0; idx < list.length; idx += 1) {
      const pathStr = list[idx];
      const node = this.unwrapSingleNestedArray(this.resolvePath(root, pathStr));
      if (Array.isArray(node)) {
        return node;
      }
    }
    return null;
  },
  resolveItemsFromConfig () {
    let candidates = null;
    if (this.config.arrayName && this.config.arrayName.length) {
      candidates = this.config.arrayName;
    } else {
      candidates = ["data.Forbruk", "Forbruk.Forbruk", "Forbruk"];
    }
    let items = this.resolveArrayWithFallbacks(this.jsonData, candidates);
    if (!Array.isArray(items)) {
      const maybeRoot = this.unwrapSingleNestedArray(this.jsonData);
      if (Array.isArray(maybeRoot)) {
        items = maybeRoot;
      }
    }
    return items;
  },
  buildTable (items) {
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    for (let idx = 0; idx < items.length; idx += 1) {
      const row = this.getTableRow(items[idx]);
      tbody.appendChild(row);
    }
    if (this.config.descriptiveRow) {
      const headerEl = table.createTHead();
      headerEl.innerHTML = this.config.descriptiveRow;
    }
    table.appendChild(tbody);
    return table;
  },
  getDom () {
    const wrapper = document.createElement("div");
    wrapper.className = "xsmall";
    try {
      if (!this.jsonData) {
        wrapper.innerHTML = "Awaiting json data...";
        return wrapper;
      }
      const items = this.resolveItemsFromConfig();
      if (!Array.isArray(items)) {
        wrapper.innerHTML = this.config.noDataText;
        return wrapper;
      }
      const table = this.buildTable(items);
      wrapper.appendChild(table);
      return wrapper;
    } catch {
      wrapper.innerHTML = "Error rendering table.";
      return wrapper;
    }
  },
  buildCell (key, value) {
    const cell = document.createElement("td");
    let valueToDisplay = "";
    let cellValue = "";

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      if ("value" in value) {
        cellValue = value.value;
      } else {
        cellValue = "";
      }

      if ("color" in value) {
        cell.style.color = value.color;
      }
    } else {
      cellValue = value;
    }

    if (key === "icon") {
      cell.classList.add("fa", cellValue);
    } else if (this.config.tryFormatDate) {
      valueToDisplay = this.getFormattedValue(cellValue);
    } else {
      valueToDisplay = cellValue;
    }
    let textContent = "";
    if (valueToDisplay === null || typeof valueToDisplay === "undefined") {
      textContent = "";
    } else {
      textContent = String(valueToDisplay);
    }
    const textNode = document.createTextNode(textContent);
    if (this.config.size > 0 && this.config.size < 9) {
      const headingEl = document.createElement(`H${String(this.config.size)}`);
      headingEl.appendChild(textNode);
      cell.appendChild(headingEl);
    } else {
      cell.appendChild(textNode);
    }
    return cell;
  },
  getTableRow (jsonObject) {
    const row = document.createElement("tr");
    let entries = [];
    const hasKeep = Array.isArray(this.config.keepColumns) && this.config.keepColumns.length > 0;
    if (hasKeep) {
      const filtered = [];
      for (let idx = 0; idx < this.config.keepColumns.length; idx += 1) {
        const key = this.config.keepColumns[idx];
        if (Object.hasOwn(jsonObject || {}, key)) {
          filtered.push([key, jsonObject[key]]);
        }
      }
      entries = filtered;
    } else {
      entries = Object.entries(jsonObject || {});
    }
    for (let idx = 0; idx < entries.length; idx += 1) {
      const [key, value] = entries[idx];
      const cell = this.buildCell(key, value);
      row.appendChild(cell);
    }
    return row;
  },
  getFormattedValue (input) {
    const momentObj = moment(input);
    if (typeof input === "string" && momentObj.isValid()) {
      const isToday = momentObj.isSame(new Date(), "day");
      const notMidnight = momentObj.hours() !== 0 || momentObj.minutes() !== 0 || momentObj.seconds() !== 0;
      if (isToday && notMidnight) {
        return momentObj.format("HH:mm:ss");
      }
      return momentObj.format("YYYY-MM-DD");
    }
    return input;
  }
});
