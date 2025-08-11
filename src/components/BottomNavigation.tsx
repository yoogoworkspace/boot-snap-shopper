
import { Home, ShoppingCart, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface BottomNavigationProps {
  showAdmin?: boolean;
}

const BottomNavigation = ({ showAdmin = false }: BottomNavigationProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 safe-area-bottom">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Link
          to="/"
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
            isActive("/") 
              ? "text-primary bg-primary/10" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </Link>
        
        <Link
          to="/cart"
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
            isActive("/cart") 
              ? "text-primary bg-primary/10" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="text-xs">Cart</span>
        </Link>

        {showAdmin && (
          <Link
            to="/admin"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              isActive("/admin") 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">Admin</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default BottomNavigation;
