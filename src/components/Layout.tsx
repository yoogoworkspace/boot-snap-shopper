
import { ReactNode } from "react";
import BottomNavigation from "./BottomNavigation";
import { useAuth } from "@/hooks/useAuth";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAdmin } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      {children}
      <BottomNavigation showAdmin={isAdmin} />
    </div>
  );
};

export default Layout;
