const notifications = {
  show(message, type = "info") {
    const container =
      document.getElementById("notification-container") ||
      this.createContainer();
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("hide");
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  },

  createContainer() {
    const container = document.createElement("div");
    container.id = "notification-container";
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";
    document.body.appendChild(container);
    return container;
  },

  success(message) {
    this.show(message, "success");
  },

  error(message) {
    this.show(message, "error");
  },

  info(message) {
    this.show(message, "info");
  },
};

module.exports = notifications;
