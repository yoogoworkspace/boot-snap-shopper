-- Fix the function security issue by setting search_path
CREATE OR REPLACE FUNCTION get_current_session_id()
RETURNS TEXT AS $$
BEGIN
  -- Get session ID from current setting (set by application)
  RETURN current_setting('app.current_session_id', true);
EXCEPTION WHEN OTHERS THEN
  -- If no session ID is set, return null (deny access)
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;