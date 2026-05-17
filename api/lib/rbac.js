/**
 * Role-Based Access Control (RBAC) with facility scoping
 * SOC 2 CC6.1 — Logical access security
 */

const PERMISSIONS = {
  super_admin: [
    'employees:read', 'employees:write', 'employees:delete',
    'schedule:read', 'schedule:write',
    'timeclock:read', 'timeclock:write',
    'onboarding:read', 'onboarding:write', 'onboarding:approve',
    'pii:reveal',
    'audit:read',
    'export:csv',
    'integrations:manage',
    'accounts:manage',
    'billing:manage',
    'reports:read', 'reports:generate',
    'incidents:manage'
  ],
  admin: [
    'employees:read', 'employees:write',
    'schedule:read', 'schedule:write',
    'timeclock:read', 'timeclock:write',
    'onboarding:read', 'onboarding:write', 'onboarding:approve',
    'export:csv',
    'integrations:manage',
    'reports:read', 'reports:generate'
  ],
  employee: [
    'employees:read:own',
    'schedule:read:own',
    'timeclock:read:own', 'timeclock:write:own'
  ],
  new_hire: [
    'onboarding:read:own', 'onboarding:write:own'
  ]
};

/**
 * Check if a role has a specific permission
 */
function hasPermission(role, permission) {
  const perms = PERMISSIONS[role];
  if (!perms) return false;
  // Direct match
  if (perms.includes(permission)) return true;
  // Check if role has the non-scoped version (e.g., 'employees:read' covers 'employees:read:own')
  const basePerm = permission.replace(/:own$/, '');
  if (perms.includes(basePerm)) return true;
  return false;
}

/**
 * Authorization middleware — checks permission and facility scope
 */
function authorize(req, permission) {
  const user = req.user;
  if (!user) {
    return { authorized: false, status: 401, message: 'Authentication required' };
  }

  if (!hasPermission(user.role, permission)) {
    return { authorized: false, status: 403, message: 'Insufficient permissions' };
  }

  return { authorized: true };
}

/**
 * Check if user has access to a specific facility
 */
function hasFacilityAccess(user, facilityId) {
  if (!user || !user.facilityIds) return false;
  // Super admins have access to all facilities
  if (user.role === 'super_admin') return true;
  return user.facilityIds.includes(facilityId);
}

/**
 * Filter data by facility scope
 */
function filterByFacility(data, user) {
  if (!Array.isArray(data)) return data;
  if (user.role === 'super_admin') return data;
  return data.filter(item => {
    const fId = item.facilityId || item.facility_id;
    return !fId || user.facilityIds.includes(fId);
  });
}

/**
 * Check segregation of duties — certain actions require different roles
 */
function checkSegregation(action, user) {
  const segregatedActions = {
    'pii:reveal': ['super_admin'],
    'audit:read': ['super_admin'],
    'accounts:manage': ['super_admin'],
    'incidents:manage': ['super_admin']
  };

  const allowedRoles = segregatedActions[action];
  if (!allowedRoles) return true;
  return allowedRoles.includes(user.role);
}

module.exports = {
  PERMISSIONS,
  hasPermission,
  authorize,
  hasFacilityAccess,
  filterByFacility,
  checkSegregation
};
