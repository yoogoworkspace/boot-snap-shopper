
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

    supabase.auth.getSession().then(({ data: { session } }) => {
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

      // Direct password check using the 'password' column from database
      console.log('Checking password against database value');
      if (password === adminUser.password) {
        console.log('Password match, setting admin status');
        setIsAdmin(true);
        
        // Create a mock user object for admin
        const mockUser = { 
          id: adminUser.id, 
          email: adminUser.email,
          aud: 'authenticated',
          role: 'authenticated',
          email_confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          created_at: adminUser.created_at,
          updated_at: new Date().toISOString()
        } as User;
        
        // Create a mock session
        const mockSession = {
          access_token: 'mock_admin_token',
          refresh_token: 'mock_refresh_token',
          expires_in: 3600,
          token_type: 'bearer',
          user: mockUser
        } as Session;
        
        setUser(mockUser);
        setSession(mockSession);
        return { error: null };
      } else {
        console.log('Password mismatch. Expected:', adminUser.password, 'Got:', password);
        return { error: { message: 'Invalid email or password' } };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    await supabase.auth.signOut();
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
