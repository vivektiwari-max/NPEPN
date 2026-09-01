const API = require("../api/api");
const tokenManager = require("./token");

const auth = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await API.auth.login(email, password);

      if (response.success) {
        // Save token and user
        tokenManager.setToken(response.token);
        tokenManager.setUser(response.user);

        return {
          success: true,
          user: response.user,
          message: response.message,
        };
      }

      return {
        success: false,
        error: response.error?.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await API.auth.logout();
      tokenManager.clearAuth();

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error) {
      // Clear auth even if logout API fails
      tokenManager.clearAuth();
      return {
        success: true,
        message: "Logged out",
      };
    }
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return (
      tokenManager.hasToken() &&
      !tokenManager.isTokenExpired(tokenManager.getToken())
    );
  },

  // Get current user
  getCurrentUser: () => {
    if (auth.isLoggedIn()) {
      return tokenManager.getUser();
    }
    return null;
  },

  // Check user role
  hasRole: (role) => {
    const user = auth.getCurrentUser();
    return user && user.role === role;
  },

  // Check if user has any of the roles
  hasAnyRole: (roles) => {
    const user = auth.getCurrentUser();
    return user && roles.includes(user.role);
  },

  // Redirect to login if not logged in
  requireLogin: (redirectUrl = "/") => {
    if (!auth.isLoggedIn()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  },

  // Redirect if user doesn't have required role
  requireRole: (role, redirectUrl = "/") => {
    if (!auth.hasRole(role)) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  },
};

module.exports = auth;
