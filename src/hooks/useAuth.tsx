
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: any | null;
  session: any | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAdmin(true);
      setSession({ user: userData });
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with:', email);
      
      // First, try to sign in with Supabase Auth using email/password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        console.log('Supabase auth failed, trying admin_users table:', authError);
        
        // Fallback to admin_users table if Supabase auth fails
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .single();

        console.log('Admin user query result:', { adminUser, adminError });

        if (adminError || !adminUser) {
          console.log('Admin user not found or error:', adminError);
          return { error: { message: 'Invalid email or password' } };
        }

        // Direct password check for admin_users table
        if (password === adminUser.password) {
          console.log('Password match, setting admin status');
          setIsAdmin(true);
          
          const userData = { 
            id: adminUser.id, 
            email: adminUser.email,
            created_at: adminUser.created_at
          };
          
          setUser(userData);
          setSession({ user: userData });
          
          // Store in localStorage for persistence
          localStorage.setItem('adminUser', JSON.stringify(userData));
          
          return { error: null };
        } else {
          console.log('Password mismatch');
          return { error: { message: 'Invalid email or password' } };
        }
      } else {
        // Supabase auth succeeded
        console.log('Supabase auth successful:', authData);
        setIsAdmin(true);
        setUser(authData.user);
        setSession(authData.session);
        
        // Store in localStorage for persistence
        localStorage.setItem('adminUser', JSON.stringify(authData.user));
        
        return { error: null };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    // Sign out from Supabase Auth if session exists
    if (session) {
      await supabase.auth.signOut();
    }
    
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    localStorage.removeItem('adminUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      signIn,
      signOut,
      loading,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
