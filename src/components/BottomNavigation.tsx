
import { Home, ShoppingCart, Shield, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

const BottomNavigation = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const totalCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(totalCount);
    };

    // Initial load
    updateCartCount();

    // Listen for storage changes (from other tabs)
    window.addEventListener('storage', updateCartCount);

    // Listen for custom cart update events
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 md:hidden">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Link to="/">
          <Button
            variant={isActive("/") ? "default" : "ghost"}
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
              isActive("/")
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
        </Link>
        
        <Link to="/search">
          <Button
            variant={isActive("/search") ? "default" : "ghost"}
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
              isActive("/search")
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs">Search</span>
          </Button>
        </Link>
        
        <Link to="/cart">
          <Button
            variant={isActive("/cart") ? "default" : "ghost"}
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 relative ${
              isActive("/cart")
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="text-xs">Cart</span>
          </Button>
        </Link>

        {isAdmin && (
          <Link to="/admin">
            <Button
              variant={isActive("/admin") ? "default" : "ghost"}
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                isActive("/admin")
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Shield className="h-5 w-5" />
              <span className="text-xs">Admin</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default BottomNavigation;
