
import { Home, ShoppingCart, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface BottomNavigationProps {
  showAdmin?: boolean;
}

const BottomNavigation = ({ showAdmin = false }: BottomNavigationProps) => {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(totalItems);
    };

    updateCartCount();
    
    // Listen for storage changes (cart updates)
    window.addEventListener('storage', updateCartCount);
    
    // Also update on focus (when returning to the page)
    window.addEventListener('focus', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('focus', updateCartCount);
    };
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 shadow-lg">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Link
          to="/"
          className={`flex flex-col items-center space-y-1 p-3 rounded-xl transition-all duration-300 ${
            isActive("/") 
              ? "text-blue-600 bg-blue-50 transform scale-110" 
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        
        <Link
          to="/cart"
          className={`flex flex-col items-center space-y-1 p-3 rounded-xl transition-all duration-300 relative ${
            isActive("/cart") 
              ? "text-blue-600 bg-blue-50 transform scale-110" 
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-xs font-medium">Cart</span>
        </Link>

        {showAdmin && (
          <Link
            to="/admin"
            className={`flex flex-col items-center space-y-1 p-3 rounded-xl transition-all duration-300 ${
              isActive("/admin") 
                ? "text-blue-600 bg-blue-50 transform scale-110" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs font-medium">Admin</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default BottomNavigation;
