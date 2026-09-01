const auth = require("./auth");

// Permission definitions
const PERMISSIONS = {
  // Student permissions
  STUDENT_VIEW_PROFILE: "student:view:profile",
  STUDENT_EDIT_PROFILE: "student:edit:profile",
  STUDENT_SEARCH_COLLEGES: "student:search:colleges",
  STUDENT_VIEW_JOBS: "student:view:jobs",

  // College permissions
  COLLEGE_VIEW_PROFILE: "college:view:profile",
  COLLEGE_EDIT_PROFILE: "college:edit:profile",
  COLLEGE_POST_JOBS: "college:post:jobs",
  COLLEGE_VIEW_APPLICATIONS: "college:view:applications",

  // Company permissions
  COMPANY_POST_JOBS: "company:post:jobs",
  COMPANY_VIEW_APPLICATIONS: "company:view:applications",

  // Admin permissions
  ADMIN_ALL: "admin:all",
};

// Role-permission mapping
const ROLE_PERMISSIONS = {
  student: [
    PERMISSIONS.STUDENT_VIEW_PROFILE,
    PERMISSIONS.STUDENT_EDIT_PROFILE,
    PERMISSIONS.STUDENT_SEARCH_COLLEGES,
    PERMISSIONS.STUDENT_VIEW_JOBS,
  ],
  college: [
    PERMISSIONS.COLLEGE_VIEW_PROFILE,
    PERMISSIONS.COLLEGE_EDIT_PROFILE,
    PERMISSIONS.COLLEGE_POST_JOBS,
    PERMISSIONS.COLLEGE_VIEW_APPLICATIONS,
  ],
  company: [
    PERMISSIONS.COMPANY_POST_JOBS,
    PERMISSIONS.COMPANY_VIEW_APPLICATIONS,
  ],
  dpc: [PERMISSIONS.STUDENT_VIEW_PROFILE, PERMISSIONS.COLLEGE_VIEW_PROFILE],
  admin: [PERMISSIONS.ADMIN_ALL],
};

const permissions = {
  // Check if user has permission
  hasPermission: (permission) => {
    const user = auth.getCurrentUser();
    if (!user) return false;

    const userRole = user.role;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    return (
      userPermissions.includes(permission) ||
      userPermissions.includes(PERMISSIONS.ADMIN_ALL)
    );
  },

  // Check if user has any permission
  hasAnyPermission: (permissionList) => {
    return permissionList.some((permission) =>
      permissions.hasPermission(permission),
    );
  },

  // Check if user has all permissions
  hasAllPermissions: (permissionList) => {
    return permissionList.every((permission) =>
      permissions.hasPermission(permission),
    );
  },

  // Get user role
  getUserRole: () => {
    const user = auth.getCurrentUser();
    return user ? user.role : null;
  },

  // Check if user is admin
  isAdmin: () => {
    return auth.hasRole("admin");
  },

  // Get role permissions
  getRolePermissions: (role) => {
    return ROLE_PERMISSIONS[role] || [];
  },
};

module.exports = { permissions, PERMISSIONS, ROLE_PERMISSIONS };
