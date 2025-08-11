
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sizes = () => {
  const { category } = useParams();
  
  // Mock data - will be replaced with Supabase data
  const availableSizes = [
    "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"
  ];

  const categoryName = category === "football-boots" ? "Football Boots" : "Running & Formal Shoes";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="container-custom flex items-center">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-card-foreground">
            {categoryName}
          </h1>
        </div>
      </header>

      {/* Sizes Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-xl font-semibold mb-8 text-center animate-fade-in">
            Select Your Size
          </h2>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 max-w-4xl mx-auto">
            {availableSizes.map((size, index) => (
              <Link
                key={size}
                to={`/models/${category}/${size}`}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="size-card hover:scale-105">
                  {size}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sizes;
