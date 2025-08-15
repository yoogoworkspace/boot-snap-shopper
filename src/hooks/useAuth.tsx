
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
        .select('id')
        .eq('email', email)
        .single();
      
      if (error) {
        console.log('Admin check error:', error);
        setIsAdmin(false);
      } else {
        console.log('Admin user found:', data);
        setIsAdmin(!!data);
      }
    } catch (error) {
      console.log('Admin check error:', error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.email) {
          setTimeout(() => {
            checkAdminStatus(session.user.email!);
          }, 100);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

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

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with:', email);
      
      // First check if this is an admin user in our admin_users table
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

      // Check password
      if (password !== adminUser.password) {
        console.log('Password mismatch');
        return { error: { message: 'Invalid email or password' } };
      }

      // Try to sign in with Supabase Auth first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError && signInError.message === 'Invalid login credentials') {
        // User doesn't exist in Supabase Auth, create them
        console.log('Creating new Supabase user for admin');
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: undefined // Skip email confirmation
          }
        });

        if (signUpError) {
          console.error('Error creating Supabase user:', signUpError);
          return { error: signUpError };
        }

        // If sign up was successful, the user should be automatically signed in
        if (signUpData.user) {
          console.log('Admin user created and signed in successfully');
          setIsAdmin(true);
          return { error: null };
        }
      } else if (signInError) {
        console.error('Sign in error:', signInError);
        return { error: signInError };
      } else if (signInData.user) {
        // Successful sign in
        console.log('Admin signed in successfully');
        setIsAdmin(true);
        return { error: null };
      }

      return { error: { message: 'An unexpected error occurred' } };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
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
