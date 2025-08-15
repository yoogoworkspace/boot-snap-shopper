
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async (email: string) => {
    try {
      console.log('Checking admin status for:', email);
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, email, password')
        .eq('email', email)
        .single();
      
      if (error) {
        console.log('Admin check error:', error);
        setIsAdmin(false);
        return null;
      } else {
        console.log('Admin user found:', data);
        setIsAdmin(!!data);
        return data;
      }
    } catch (error) {
      console.log('Admin check error:', error);
      setIsAdmin(false);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        checkAdminStatus(session.user.email);
      }
      setLoading(false);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.email) {
          checkAdminStatus(session.user.email);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with:', email);
      
      // First check if the user exists in admin_users table
      const adminUser = await checkAdminStatus(email);
      
      if (!adminUser) {
        console.log('Admin user not found');
        return { error: { message: 'Invalid email or password' } };
      }

      // Check password
      if (password !== adminUser.password) {
        console.log('Password mismatch');
        return { error: { message: 'Invalid email or password' } };
      }

      console.log('Password match, attempting Supabase auth');
      
      // Try to sign up the user in Supabase auth if they don't exist
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (signUpError && !signUpError.message.includes('already registered')) {
        console.log('Sign up error:', signUpError);
        return { error: signUpError };
      }

      // Now sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        console.log('Sign in error:', signInError);
        return { error: signInError };
      }

      console.log('Successfully signed in:', signInData);
      setIsAdmin(true);
      return { error: null };
      
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
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
