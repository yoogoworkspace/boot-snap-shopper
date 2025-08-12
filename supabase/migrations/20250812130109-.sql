-- Drop the current insufficient policies and implement proper session-based security
DROP POLICY IF EXISTS "Restrict cart access to session owner" ON public.cart_items;
DROP POLICY IF EXISTS "Cart items session validation" ON public.cart_items;

-- Create a function to get the current session ID from the application context
-- This will be set by the application when making database calls
CREATE OR REPLACE FUNCTION get_current_session_id()
RETURNS TEXT AS $$
BEGIN
  -- Get session ID from current setting (set by application)
  RETURN current_setting('app.current_session_id', true);
EXCEPTION WHEN OTHERS THEN
  -- If no session ID is set, return null (deny access)
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create secure RLS policy that only allows access to cart items with matching session_id
CREATE POLICY "Secure session-based cart access" 
ON public.cart_items 
FOR ALL 
USING (
  -- Allow access only if session_id matches the current application session
  session_id = get_current_session_id()
  AND session_id IS NOT NULL 
  AND session_id != ''
)
WITH CHECK (
  -- Ensure new items use the current session
  session_id = get_current_session_id()
  AND session_id IS NOT NULL 
  AND session_id != ''
);