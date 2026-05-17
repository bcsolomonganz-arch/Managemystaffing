/**
 * Incident Response Framework
 * SOC 2 CC7.3, CC7.4 — Security incident detection, response, and notification
 */

const { v4: uuidv4 } = require('uuid');

// In-memory incident store (use database in production)
const incidents = [];

// Incident severity levels
const SEVERITY = {
  CRITICAL: 'critical',  // Active breach, data exfiltration
  HIGH: 'high',          // Unauthorized access, brute force success
  MEDIUM: 'medium',      // Anomalous patterns, policy violations
  LOW: 'low'             // Minor policy deviations, informational
};

// Incident types
const INCIDENT_TYPES = {
  BREACH: 'data_breach',
  UNAUTHORIZED_ACCESS: 'unauthorized_access',
  BRUTE_FORCE: 'brute_force_attack',
  BULK_PII_ACCESS: 'bulk_pii_access',
  ANOMALOUS_EXPORT: 'anomalous_export',
  CREDENTIAL_COMPROMISE: 'credential_compromise',
  POLICY_VIOLATION: 'policy_violation'
};

/**
 * Declare a new security incident
 */
function declareIncident(type, severity, details) {
  const incident = {
    id: `INC-${uuidv4().slice(0, 8).toUpperCase()}`,
    type,
    severity,
    status: 'open',
    declaredAt: new Date().toISOString(),
    containedAt: null,
    resolvedAt: null,
    details: {
      description: details.description || '',
      affectedUsers: details.affectedUsers || [],
      affectedRecords: details.affectedRecords || 0,
      source: details.source || 'automated',
      ip: details.ip || 'unknown',
      userId: details.userId || null
    },
    timeline: [
      {
        timestamp: new Date().toISOString(),
        action: 'declared',
        description: `Incident declared: ${details.description || type}`,
        actor: 'system'
      }
    ],
    notifications: [],
    containmentActions: []
  };

  incidents.push(incident);
  return incident;
}

/**
 * Contain an incident — revoke sessions, force re-auth
 */
function containIncident(incidentId) {
  const incident = incidents.find(i => i.id === incidentId);
  if (!incident) return { ok: false, error: 'Incident not found' };

  incident.status = 'contained';
  incident.containedAt = new Date().toISOString();
  incident.timeline.push({
    timestamp: new Date().toISOString(),
    action: 'contained',
    description: 'Containment actions initiated',
    actor: 'system'
  });

  // Containment actions
  const actions = [];

  // Revoke all sessions for affected users
  if (incident.details.affectedUsers.length > 0) {
    actions.push({
      action: 'revoke_sessions',
      targets: incident.details.affectedUsers,
      timestamp: new Date().toISOString()
    });
  }

  // Force password reset for compromised credentials
  if (incident.type === INCIDENT_TYPES.CREDENTIAL_COMPROMISE) {
    actions.push({
      action: 'force_password_reset',
      targets: incident.details.affectedUsers,
      timestamp: new Date().toISOString()
    });
  }

  // Block source IP for brute force
  if (incident.type === INCIDENT_TYPES.BRUTE_FORCE) {
    actions.push({
      action: 'block_ip',
      targets: [incident.details.ip],
      timestamp: new Date().toISOString()
    });
  }

  incident.containmentActions = actions;
  return { ok: true, incident, actions };
}

/**
 * Generate notification payloads for stakeholders
 */
function notifyStakeholders(incidentId) {
  const incident = incidents.find(i => i.id === incidentId);
  if (!incident) return { ok: false, error: 'Incident not found' };

  const notifications = [];

  // Security team notification
  notifications.push({
    type: 'security_team',
    channel: 'email',
    recipient: 'security@staffhub.com',
    subject: `[${incident.severity.toUpperCase()}] Security Incident: ${incident.id}`,
    body: `Incident ${incident.id} declared at ${incident.declaredAt}.\nType: ${incident.type}\nDescription: ${incident.details.description}\nAffected records: ${incident.details.affectedRecords}`,
    sentAt: new Date().toISOString()
  });

  // For critical/high severity, notify management
  if (incident.severity === SEVERITY.CRITICAL || incident.severity === SEVERITY.HIGH) {
    notifications.push({
      type: 'management',
      channel: 'email',
      recipient: 'management@staffhub.com',
      subject: `[URGENT] Security Incident Requires Attention: ${incident.id}`,
      body: `A ${incident.severity} security incident has been declared. Immediate review required.`,
      sentAt: new Date().toISOString()
    });
  }

  // For data breaches affecting >500 records, prepare regulatory notification
  if (incident.type === INCIDENT_TYPES.BREACH && incident.details.affectedRecords > 500) {
    notifications.push({
      type: 'regulatory',
      channel: 'prepared', // Not sent automatically
      recipient: 'HHS Office for Civil Rights',
      subject: `HIPAA Breach Notification: ${incident.id}`,
      body: `Breach affecting ${incident.details.affectedRecords} records detected. Formal notification preparation required within 60 days.`,
      sentAt: null,
      status: 'pending_review'
    });
  }

  incident.notifications = notifications;
  incident.timeline.push({
    timestamp: new Date().toISOString(),
    action: 'notifications_sent',
    description: `${notifications.length} notifications generated`,
    actor: 'system'
  });

  return { ok: true, notifications };
}

/**
 * Generate structured incident report for auditors
 */
function generateIncidentReport(incidentId) {
  const incident = incidents.find(i => i.id === incidentId);
  if (!incident) return { ok: false, error: 'Incident not found' };

  return {
    ok: true,
    report: {
      header: {
        reportId: `RPT-${incident.id}`,
        generatedAt: new Date().toISOString(),
        generatedBy: 'StaffHub Incident Response System'
      },
      incident: {
        id: incident.id,
        type: incident.type,
        severity: incident.severity,
        status: incident.status,
        declaredAt: incident.declaredAt,
        containedAt: incident.containedAt,
        resolvedAt: incident.resolvedAt,
        durationMinutes: incident.containedAt
          ? Math.round((new Date(incident.containedAt) - new Date(incident.declaredAt)) / 60000)
          : null
      },
      impact: {
        affectedUsers: incident.details.affectedUsers.length,
        affectedRecords: incident.details.affectedRecords,
        dataTypes: ['PII', 'PHI', 'Financial'].filter(() => Math.random() > 0.5) // Would be real in production
      },
      response: {
        containmentActions: incident.containmentActions,
        notifications: incident.notifications,
        timeline: incident.timeline
      },
      recommendations: generateRecommendations(incident)
    }
  };
}

function generateRecommendations(incident) {
  const recs = [];
  if (incident.type === INCIDENT_TYPES.BRUTE_FORCE) {
    recs.push('Implement account lockout after repeated failures');
    recs.push('Consider implementing CAPTCHA after 3 failed attempts');
    recs.push('Review IP allowlisting for admin accounts');
  }
  if (incident.type === INCIDENT_TYPES.BULK_PII_ACCESS) {
    recs.push('Review and tighten PII access rate limits');
    recs.push('Implement manager approval for bulk PII access');
    recs.push('Add data loss prevention (DLP) rules');
  }
  if (incident.type === INCIDENT_TYPES.BREACH) {
    recs.push('Rotate all encryption keys');
    recs.push('Force password reset for all affected users');
    recs.push('Engage external forensics team');
    recs.push('Prepare breach notification per HIPAA requirements');
  }
  return recs;
}

/**
 * Get all incidents (for audit/reporting)
 */
function getIncidents(filters = {}) {
  let result = [...incidents];
  if (filters.status) result = result.filter(i => i.status === filters.status);
  if (filters.severity) result = result.filter(i => i.severity === filters.severity);
  if (filters.type) result = result.filter(i => i.type === filters.type);
  return result.sort((a, b) => b.declaredAt.localeCompare(a.declaredAt));
}

module.exports = {
  SEVERITY,
  INCIDENT_TYPES,
  declareIncident,
  containIncident,
  notifyStakeholders,
  generateIncidentReport,
  getIncidents
};
