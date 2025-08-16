
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
}

interface ShopHeaderProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const ShopHeader = ({ categories, activeCategory, onCategoryChange }: ShopHeaderProps) => {
  return (
    <header className="h-16 bg-background border-b border-border px-6 flex items-center">
      <div className="flex space-x-1">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "ghost"}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeCategory === category.id
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </header>
  );
};
