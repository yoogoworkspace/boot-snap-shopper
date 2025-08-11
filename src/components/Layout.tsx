
import { ReactNode } from "react";
import BottomNavigation from "./BottomNavigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-20">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;
