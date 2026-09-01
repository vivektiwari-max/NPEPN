const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[6-9]\d{9}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
};

const validation = {
  isValidEmail: (value) => REGEX.email.test(String(value || "").trim()),
  isValidPhone: (value) => REGEX.phone.test(String(value || "").trim()),
  isValidPassword: (value) => REGEX.password.test(String(value || "")),

  required: (value, fieldName = "This field") => {
    const trimmed = typeof value === "string" ? value.trim() : value;
    return trimmed !== "" && trimmed !== null && trimmed !== undefined;
  },

  normalize: (value) => (typeof value === "string" ? value.trim() : value),

  validateLogin: ({ email, password }) => {
    if (!validation.required(email, "Email")) return "Email is required.";
    if (!validation.isValidEmail(email))
      return "Please enter a valid email address.";
    if (!validation.required(password, "Password"))
      return "Password is required.";
    return null;
  },

  validateStudentRegistration: (data) => {
    if (!validation.required(data.name)) return "Name is required.";
    if (!validation.isValidEmail(data.email))
      return "Please enter a valid email address.";
    if (!validation.isValidPhone(data.phone))
      return "Please enter a valid 10-digit mobile number.";
    if (!validation.isValidPassword(data.password))
      return "Password must be at least 8 characters with letters, numbers and a special character.";
    if (data.password !== data.confirmPassword)
      return "Passwords do not match.";
    if (!validation.required(data.degree)) return "Degree is required.";
    if (!validation.required(data.college)) return "College is required.";
    if (!validation.required(data.district)) return "District is required.";
    if (!validation.required(data.skills)) return "Skills are required.";
    return null;
  },

  validateCollegeRegistration: (data) => {
    if (!validation.required(data.institution_name))
      return "Institution name is required.";
    if (!validation.required(data.authorizedPerson))
      return "Authorized person is required.";
    if (!validation.isValidEmail(data.email))
      return "Please enter a valid email address.";
    if (!validation.isValidPhone(data.mobile))
      return "Please enter a valid 10-digit mobile number.";
    if (!validation.isValidPassword(data.password))
      return "Password must be at least 8 characters with letters, numbers and a special character.";
    if (data.password !== data.confirmPassword)
      return "Passwords do not match.";
    if (!validation.required(data.address)) return "Address is required.";
    if (!validation.required(data.college_id)) return "College ID is required.";
    return null;
  },
};

module.exports = validation;
