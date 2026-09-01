// API Configuration
const API_BASE_URL = "http://localhost:3000/api";

const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  GET_CURRENT_USER: `${API_BASE_URL}/auth/me`,
  VERIFY_TOKEN: `${API_BASE_URL}/auth/verify-token`,

  // Students
  REGISTER_STUDENT: `${API_BASE_URL}/students`,
  GET_ALL_STUDENTS: `${API_BASE_URL}/students`,
  GET_STUDENT_PROFILE: `${API_BASE_URL}/students/profile`,
  UPDATE_STUDENT: (id) => `${API_BASE_URL}/students/${id}`,
  DELETE_STUDENT: (id) => `${API_BASE_URL}/students/${id}`,
  SEARCH_STUDENTS_BY_COLLEGE: `${API_BASE_URL}/students/search/college`,
  GET_STUDENTS_BY_DISTRICT: `${API_BASE_URL}/students/search/district`,

  // Colleges
  REGISTER_COLLEGE: `${API_BASE_URL}/colleges/register`,
  GET_ALL_COLLEGES: `${API_BASE_URL}/colleges`,
  SEARCH_COLLEGES: `${API_BASE_URL}/colleges/search`,
  GET_COLLEGE_PROFILE: (collegeId) => `${API_BASE_URL}/colleges/${collegeId}`,
  UPDATE_COLLEGE: (collegeId) => `${API_BASE_URL}/colleges/${collegeId}`,
  DELETE_COLLEGE: (collegeId) => `${API_BASE_URL}/colleges/${collegeId}`,
};

module.exports = {
  API_BASE_URL,
  API_ENDPOINTS,
};
