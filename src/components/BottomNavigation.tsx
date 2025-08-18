import { Home, ShoppingCart, Shield } from "lucide-react";
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
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      const totalCount = cartItems.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );
      setCartCount(totalCount);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 shadow-sm">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {/* Home */}
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 transition-colors ${
              isActive("/")
                ? "text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </Button>
        </Link>

        {/* Cart */}
        <Link to="/cart">
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 relative transition-colors ${
              isActive("/cart")
                ? "text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
            <span className="text-xs font-medium">Cart</span>
          </Button>
        </Link>

        {/* Admin (only if logged as admin) */}
        {isAdmin && (
          <Link to="/admin">
            <Button
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 transition-colors ${
                isActive("/admin")
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Shield className="h-5 w-5" />
              <span className="text-xs font-medium">Admin</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default BottomNavigation;
