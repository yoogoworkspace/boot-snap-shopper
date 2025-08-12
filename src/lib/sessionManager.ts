// Session management utility for secure cart functionality
import { supabase } from '@/integrations/supabase/client';

const SESSION_KEY = 'cart_session_id';

/**
 * Gets or creates a session ID for the current user's cart
 */
export function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    // Generate a new secure session ID
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
}

/**
 * Sets the session ID in the database context for RLS
 */
export async function setDatabaseSessionContext(sessionId: string) {
  try {
    // Set the session ID in the database context for RLS policy
    await supabase.rpc('set_config', {
      setting_name: 'app.current_session_id',
      setting_value: sessionId,
      is_local: true
    });
  } catch (error) {
    console.error('Failed to set database session context:', error);
  }
}

/**
 * Performs a database operation with proper session context
 */
export async function withSessionContext<T>(
  operation: () => Promise<T>
): Promise<T> {
  const sessionId = getSessionId();
  await setDatabaseSessionContext(sessionId);
  return operation();
}

/**
 * Clears the current session (useful for logout or cart reset)
 */
export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}