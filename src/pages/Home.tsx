import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center">
      {/* Title */}
      <h1 className="text-5xl font-extrabold text-slate-800 mt-8 mb-12">
        Boot Bucket
      </h1>

      {/* Categories Section */}
      <main className="container mx-auto px-6 py-0">
        <motion.div
          className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Link to={`/sizes/${category.id}`}>
                <Card className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500">
                  <div className="relative overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-30 group-hover:opacity-50 transition-opacity duration-500`}
                    />
                  </div>
                  <CardContent className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-6">
                    <h2 className="text-3xl font-bold drop-shadow-lg mb-6">
                      {category.name}
                    </h2>
                    <Button
                      className="bg-white/90 text-slate-900 px-6 py-2 rounded-full font-medium shadow-md 
                                hover:shadow-lg hover:scale-105 hover:bg-slate-900 hover:text-white 
                                transition-all duration-300"
                    >
                      Explore Collection
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Home;
