const state = {
  data: {},

  set(key, value) {
    this.data[key] = value;
    return value;
  },

  get(key, fallback = null) {
    return Object.prototype.hasOwnProperty.call(this.data, key)
      ? this.data[key]
      : fallback;
  },

  remove(key) {
    delete this.data[key];
  },

  clear() {
    this.data = {};
  },

  hydrateFromStorage(storageKey, defaultValue = null) {
    try {
      const value = localStorage.getItem(storageKey);
      if (!value) return defaultValue;
      this.data[storageKey] = JSON.parse(value);
      return this.data[storageKey];
    } catch (error) {
      console.warn("Could not hydrate state from storage:", error);
      return defaultValue;
    }
  },
};

module.exports = state;
