import { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';

/**
 * Session Manager - Idle timeout, absolute timeout, multi-tab sync
 * SOC 2 CC6.1 - Session management controls
 */

const IDLE_TIMEOUT_MS = 15 * 60 * 1000;        // 15 minutes
const IDLE_TIMEOUT_HIDDEN_MS = 5 * 60 * 1000;  // 5 min when tab hidden
const ABSOLUTE_TIMEOUT_MS = 8 * 60 * 60 * 1000; // 8 hours
const WARNING_BEFORE_MS = 60 * 1000;            // Show warning 60s before logout
const HEARTBEAT_INTERVAL_MS = 5 * 60 * 1000;   // 5 min heartbeat
const THROTTLE_MS = 30000;                      // Throttle activity detection to 30s

const SessionContext = createContext(null);

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}

export function SessionProvider({ children, onLogout, onTokenRefresh }) {
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);

  const sessionActiveRef = useRef(true);
  const idleTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const absoluteTimerRef = useRef(null);
  const heartbeatRef = useRef(null);
  const countdownRef = useRef(null);
  const sessionStartRef = useRef(Date.now());
  const channelRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const onLogoutRef = useRef(onLogout);
  const onTokenRefreshRef = useRef(onTokenRefresh);

  // Keep refs updated
  onLogoutRef.current = onLogout;
  onTokenRefreshRef.current = onTokenRefresh;

  const clearAllTimers = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (absoluteTimerRef.current) clearTimeout(absoluteTimerRef.current);
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  const performLogout = useCallback((reason = 'idle') => {
    if (!sessionActiveRef.current) return;
    sessionActiveRef.current = false;
    setShowWarning(false);
    clearAllTimers();

    // Notify other tabs
    if (channelRef.current) {
      try { channelRef.current.postMessage({ type: 'logout', reason }); } catch(e) {}
    }

    // Clear any sensitive data from sessionStorage
    sessionStorage.clear();

    if (onLogoutRef.current) onLogoutRef.current(reason);
  }, [clearAllTimers]);

  const resetIdleTimer = useCallback(() => {
    if (!sessionActiveRef.current) return;

    // Check absolute timeout
    if (Date.now() - sessionStartRef.current >= ABSOLUTE_TIMEOUT_MS) {
      performLogout('absolute_timeout');
      return;
    }

    setShowWarning(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    const isHidden = document.hidden;
    const timeout = isHidden ? IDLE_TIMEOUT_HIDDEN_MS : IDLE_TIMEOUT_MS;

    // Set warning timer (fires WARNING_BEFORE_MS before actual logout)
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      setSecondsLeft(Math.round(WARNING_BEFORE_MS / 1000));
      countdownRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            performLogout('idle');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, timeout - WARNING_BEFORE_MS);

    // Set final logout timer
    idleTimerRef.current = setTimeout(() => {
      performLogout('idle');
    }, timeout);
  }, [performLogout]);

  const stayActive = useCallback(() => {
    setShowWarning(false);
    if (countdownRef.current) clearInterval(countdownRef.current);
    resetIdleTimer();
  }, [resetIdleTimer]);

  // Activity listeners (throttled to avoid excessive timer resets)
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivityRef.current < THROTTLE_MS) return;
      lastActivityRef.current = now;
      resetIdleTimer();
    };

    const handleVisibility = () => {
      if (!document.hidden) resetIdleTimer();
    };

    events.forEach(evt => document.addEventListener(evt, handleActivity, { passive: true }));
    document.addEventListener('visibilitychange', handleVisibility);

    // Initial timer
    resetIdleTimer();

    // Absolute timeout
    absoluteTimerRef.current = setTimeout(() => {
      performLogout('absolute_timeout');
    }, ABSOLUTE_TIMEOUT_MS);

    return () => {
      events.forEach(evt => document.removeEventListener(evt, handleActivity));
      document.removeEventListener('visibilitychange', handleVisibility);
      clearAllTimers();
    };
  }, []); // Empty deps - refs handle updates

  // Multi-tab sync via BroadcastChannel
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;

    channelRef.current = new BroadcastChannel('staffhub_session');
    channelRef.current.onmessage = (event) => {
      if (event.data?.type === 'logout') {
        sessionActiveRef.current = false;
        clearAllTimers();
        if (onLogoutRef.current) onLogoutRef.current(event.data.reason || 'other_tab');
      }
    };

    return () => {
      if (channelRef.current) channelRef.current.close();
    };
  }, [clearAllTimers]);

  // Heartbeat - validate session server-side
  useEffect(() => {
    heartbeatRef.current = setInterval(async () => {
      if (!sessionActiveRef.current) return;
      if (onTokenRefreshRef.current) {
        try {
          await onTokenRefreshRef.current();
        } catch (err) {
          performLogout('token_expired');
        }
      }
    }, HEARTBEAT_INTERVAL_MS);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [performLogout]);

  const contextValue = {
    sessionActive: sessionActiveRef.current,
    showWarning,
    secondsLeft,
    stayActive,
    logout: performLogout
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}

export default SessionProvider;
