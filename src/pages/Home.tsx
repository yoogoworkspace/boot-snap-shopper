import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NativeAd from "../NativeAd";

const Home = () => {
  const categories = [
    {
      id: "football-boots",
      name: "Football Boots",
      gradient: "from-blue-600 to-indigo-600",
      image:
        "https://blobsoccerbibleprod.blob.core.windows.net/media/138958/lucent-sb-tab.jpg",
    },
    {
      id: "running-formal-shoes",
      name: "Running & Formal Shoes",
      gradient: "from-emerald-500 to-teal-500",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=300&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="text-center py-14">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
          Boot Bucket
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Explore premium collections tailored for performance & style
        </p>
      </header>

      {/* Categories */}
      <main className="container mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {categories.map((category) => (
            <Link key={category.id} to={`/sizes/${category.id}`}>
              <Card className="group cursor-pointer overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl">
                <div className="relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-56 object-cover rounded-t-2xl"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300 rounded-t-2xl`}
                  />
                </div>
                <CardContent className="p-8 text-center">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                    {category.name}
                  </h2>
                  <Button
                    className={`bg-gradient-to-r ${category.gradient} text-white px-8 py-3 rounded-full font-medium hover:shadow-md transition-transform duration-300 group-hover:scale-105`}
                  >
                    Explore Collection
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <NativeAd />
    </div>
  );
};

export default Home;
