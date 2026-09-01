const helpers = {
  formatDate(dateValue, locale = "en-IN") {
    if (!dateValue) return "-";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },

  capitalize(value) {
    if (!value) return "";
    return String(value).charAt(0).toUpperCase() + String(value).slice(1);
  },

  slugify(value) {
    if (!value) return "";
    return String(value)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  },

  safeJsonParse(value, fallback = null) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  },

  debounce(fn, delay = 300) {
    let timerId = null;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => fn(...args), delay);
    };
  },
};

module.exports = helpers;
