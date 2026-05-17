/**
 * CSRF Token Manager
 * SOC 2 CC6.1 — Cross-site request forgery protection
 *
 * Stores CSRF token in memory (from login response)
 * and auto-attaches to state-changing requests.
 */

/**
 * Create a secure fetch wrapper that auto-attaches auth and CSRF headers
 * @param {string} csrfToken - CSRF token from login/refresh response
 * @param {string} accessToken - JWT access token
 * @returns {Function} Wrapped fetch function
 */
export function createSecureFetch(csrfToken, accessToken) {
  return async function secureFetch(url, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    const headers = new Headers(options.headers || {});

    // Always attach Authorization
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    // Attach CSRF token on state-changing methods
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      if (csrfToken) {
        headers.set('X-CSRF-Token', csrfToken);
      }
    }

    // Set content type for JSON bodies
    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData) && !(options.body instanceof Blob)) {
      headers.set('Content-Type', 'application/json');
      options.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'same-origin' // Include cookies for same-origin requests
    });

    // Handle 401 — token expired
    if (response.status === 401) {
      // Attempt token refresh could be handled here
      throw new AuthError('Session expired', 401);
    }

    // Handle 403 — insufficient permissions
    if (response.status === 403) {
      throw new AuthError('Insufficient permissions', 403);
    }

    // Handle 429 — rate limited
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      throw new RateLimitError('Rate limited', retryAfter);
    }

    return response;
  };
}

/**
 * Custom error for auth failures
 */
export class AuthError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

/**
 * Custom error for rate limiting
 */
export class RateLimitError extends Error {
  constructor(message, retryAfter) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}
