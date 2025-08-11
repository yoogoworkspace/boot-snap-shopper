
import { Home, ShoppingCart, Grid3X3, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const BottomNavigation = () => {
  const location = useLocation();
  const cartItems = 0; // This will be connected to actual cart state later

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Grid3X3, label: "Categories", path: "/" },
    { icon: ShoppingCart, label: "Cart", path: "/cart", badge: cartItems },
    { icon: Settings, label: "Admin", path: "/admin" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''} relative p-2`}
            >
              <div className="relative">
                <Icon size={24} />
                {item.badge && item.badge > 0 && (
                  <Badge className="nav-badge">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
