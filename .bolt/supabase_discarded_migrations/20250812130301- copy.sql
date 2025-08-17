-- Create a function to set the session ID in the database context
CREATE OR REPLACE FUNCTION set_session_context(session_id TEXT)
RETURNS VOID AS $$
BEGIN
  -- Set the session ID for the current transaction
  PERFORM set_config('app.current_session_id', session_id, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;