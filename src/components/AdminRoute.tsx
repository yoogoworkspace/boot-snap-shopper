
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading, isAdmin } = useAuth();

  console.log('AdminRoute - User:', user?.email, 'IsAdmin:', isAdmin, 'Loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    console.log('No user, redirecting to admin-auth');
    return <Navigate to="/admin-auth" replace />;
  }

  if (!isAdmin) {
    console.log('User is not admin, redirecting to admin-auth');
    return <Navigate to="/admin-auth" replace />;
  }

  return <>{children}</>;
}
