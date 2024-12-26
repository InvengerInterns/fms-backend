// User roles
export const users = {
  SUPER_ADMIN: 'super_admin', // Role with the highest level of access
  ADMIN: 'admin', // Role with administrative privileges
  USER: 'user', // Regular user role with basic access
};

// Access control levels
export const accessControls = {
  NO_ACCESS: 0, // No access to the resource
  READ: 1, // Read-only access
  WRITE: 2, // Read and Create access
  MODIFY: 3, // Read, Create, Update and Delete access
};

export const permission_Ids = {
  ABOUT: 1,
  INTERVIEWS: 2,
  SALARY_SLIP: 3,
  OFFER_CONFIRMATION: 4,
  OFFER_LETTER: 5,
  ONBOARDING: 6,
  BACKGROUND_VERIFICATION: 7,
  PERFORMANCE_APPRAISAL: 8,
  CERTIFICATION: 9,
  HR_SCREENING: 10,
  EXIT_FORMALITIES: 11,
  CLIENT_HISTORY: 12,
};

export const employeeStatus = {
  ACTIVE: 1,
  RELIEVED: 0,
  ACTIVE_IDLE: 2,
}