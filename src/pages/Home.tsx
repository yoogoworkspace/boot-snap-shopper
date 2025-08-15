
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NativeAd from "../NativeAd";

const Home = () => {
  const categories = [
    {
      id: "football-boots",
      name: "Football Boots",
      gradient: "from-blue-600 to-purple-600",
      image: "https://www.soccerbible.com/media/138945/lucent-sb-1.jpg"
    },
    {
      id: "running-formal-shoes", 
      name: "Running & Formal Shoes",
      gradient: "from-green-500 to-teal-500",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=300&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            BOOT BUCKET
          </h1>
        </div>

        {/* Category Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {categories.map((category) => (
            <Link key={category.id} to={`/sizes/${category.id}`}>
              <Card className="group cursor-pointer overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardContent className="p-8 text-center relative">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    {category.name}
                  </h2>
                  <Button 
                    className={`bg-gradient-to-r ${category.gradient} text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform transition-all duration-300 group-hover:scale-105`}
                  >
                    Explore Collection
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <NativeAd />
    </div>
  );
};

export default Home;
