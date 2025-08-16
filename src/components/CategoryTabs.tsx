
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const categories = [
  {
    id: "football-boots",
    name: "Boots",
  },
  {
    id: "running-formal-shoes", 
    name: "Shoes",
  }
];

export const CategoryTabs = () => {
  const { category } = useParams();

  return (
    <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
      {categories.map((cat) => (
        <Link key={cat.id} to={`/sizes/${cat.id}`} className="flex-1">
          <Button
            variant={category === cat.id ? "default" : "ghost"}
            className={`w-full ${
              category === cat.id
                ? "bg-black text-white hover:bg-gray-800"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {cat.name}
          </Button>
        </Link>
      ))}
    </div>
  );
};
