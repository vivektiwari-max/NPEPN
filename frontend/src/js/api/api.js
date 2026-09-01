const { API_ENDPOINTS } = require("./endpoints");
const { getToken } = require("../auth/token");

// Helper function to make API calls
const makeRequest = async (url, options = {}) => {
  try {
    const token = getToken();

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// API Module
const API = {
  // ==========================================
  // AUTH ENDPOINTS
  // ==========================================

  auth: {
    login: async (email, password) => {
      return makeRequest(API_ENDPOINTS.LOGIN, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    },

    logout: async () => {
      return makeRequest(API_ENDPOINTS.LOGOUT, {
        method: "POST",
      });
    },

    getCurrentUser: async () => {
      return makeRequest(API_ENDPOINTS.GET_CURRENT_USER, {
        method: "GET",
      });
    },

    verifyToken: async () => {
      return makeRequest(API_ENDPOINTS.VERIFY_TOKEN, {
        method: "POST",
      });
    },
  },

  // ==========================================
  // STUDENT ENDPOINTS
  // ==========================================

  students: {
    register: async (studentData) => {
      return makeRequest(API_ENDPOINTS.REGISTER_STUDENT, {
        method: "POST",
        body: JSON.stringify(studentData),
      });
    },

    getAll: async (limit = 20, offset = 0) => {
      const url = `${API_ENDPOINTS.GET_ALL_STUDENTS}?limit=${limit}&offset=${offset}`;
      return makeRequest(url, {
        method: "GET",
      });
    },

    getProfile: async (email = null) => {
      const url = email
        ? `${API_ENDPOINTS.GET_STUDENT_PROFILE}?email=${email}`
        : API_ENDPOINTS.GET_STUDENT_PROFILE;
      return makeRequest(url, {
        method: "GET",
      });
    },

    update: async (id, studentData) => {
      return makeRequest(API_ENDPOINTS.UPDATE_STUDENT(id), {
        method: "PUT",
        body: JSON.stringify(studentData),
      });
    },

    delete: async (id) => {
      return makeRequest(API_ENDPOINTS.DELETE_STUDENT(id), {
        method: "DELETE",
      });
    },

    searchByCollege: async (college, limit = 20) => {
      const url = `${API_ENDPOINTS.SEARCH_STUDENTS_BY_COLLEGE}?college=${college}&limit=${limit}`;
      return makeRequest(url, {
        method: "GET",
      });
    },

    getByDistrict: async (district, limit = 20) => {
      const url = `${API_ENDPOINTS.GET_STUDENTS_BY_DISTRICT}?district=${district}&limit=${limit}`;
      return makeRequest(url, {
        method: "GET",
      });
    },
  },

  // ==========================================
  // COLLEGE ENDPOINTS
  // ==========================================

  colleges: {
    register: async (collegeData) => {
      return makeRequest(API_ENDPOINTS.REGISTER_COLLEGE, {
        method: "POST",
        body: JSON.stringify(collegeData),
      });
    },

    getAll: async (limit = 100, offset = 0) => {
      const url = `${API_ENDPOINTS.GET_ALL_COLLEGES}?limit=${limit}&offset=${offset}`;
      return makeRequest(url, {
        method: "GET",
      });
    },

    search: async (searchTerm = null, state = null, district = null) => {
      let url = API_ENDPOINTS.SEARCH_COLLEGES;
      const params = [];

      if (searchTerm) params.push(`search=${searchTerm}`);
      if (state) params.push(`state=${state}`);
      if (district) params.push(`district=${district}`);

      if (params.length > 0) {
        url += "?" + params.join("&");
      }

      return makeRequest(url, {
        method: "GET",
      });
    },

    getProfile: async (collegeId) => {
      return makeRequest(API_ENDPOINTS.GET_COLLEGE_PROFILE(collegeId), {
        method: "GET",
      });
    },

    update: async (collegeId, collegeData) => {
      return makeRequest(API_ENDPOINTS.UPDATE_COLLEGE(collegeId), {
        method: "PUT",
        body: JSON.stringify(collegeData),
      });
    },

    delete: async (collegeId) => {
      return makeRequest(API_ENDPOINTS.DELETE_COLLEGE(collegeId), {
        method: "DELETE",
      });
    },
  },
};

module.exports = API;
