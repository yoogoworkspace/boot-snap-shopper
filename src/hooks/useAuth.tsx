
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

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
      try {
        const userData = JSON.parse(adminUser);
        setUser(userData);
        setIsAdmin(true);
      } catch (error) {
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with:', email);
      
      // Check against admin_users table
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();

      if (adminError) {
        console.log('Admin user lookup error:', adminError);
        return { error: { message: 'Invalid email or password' } };
      }

      if (!adminUser) {
        console.log('No admin user found with email:', email);
        return { error: { message: 'Invalid email or password' } };
      }

      console.log('Found admin user:', adminUser.email);

      // Simple password check for demo (in production, use proper hashing)
      if (password === 'admin123') {
        console.log('Password correct, logging in');
        
        // Create mock user object
        const mockUser = { 
          id: adminUser.id, 
          email: adminUser.email,
          aud: 'authenticated',
          role: 'authenticated',
          email_confirmed_at: new Date().toISOString(),
          phone: '',
          confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
          identities: [],
          created_at: adminUser.created_at,
          updated_at: new Date().toISOString()
        } as User;
        
        setUser(mockUser);
        setIsAdmin(true);
        
        // Store in localStorage for persistence
        localStorage.setItem('adminUser', JSON.stringify(mockUser));
        
        return { error: null };
      } else {
        console.log('Password incorrect');
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
