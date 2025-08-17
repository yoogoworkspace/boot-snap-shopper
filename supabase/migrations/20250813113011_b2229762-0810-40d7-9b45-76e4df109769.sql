
-- Fix the infinite recursion in admin_users RLS policy
-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

-- Create a simpler policy that doesn't cause recursion
-- This policy allows authenticated users to view admin_users if they are admins themselves
CREATE POLICY "Admin users can view admin table"
ON admin_users
FOR SELECT
USING (user_id = auth.uid());

-- Also ensure we have proper policies for other operations
CREATE POLICY "System can insert admin users"
ON admin_users
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admin users can update their own record"
ON admin_users
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin users can delete their own record"
ON admin_users
FOR DELETE
USING (user_id = auth.uid());
