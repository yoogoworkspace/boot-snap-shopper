
import { ArrowLeft, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { SizeManager } from "@/components/admin/SizeManager";
import { ModelManager } from "@/components/admin/ModelManager";
import { WhatsAppManager } from "@/components/admin/WhatsAppManager";

const Admin = () => {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">
              Admin Panel
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">
              {user?.email}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="text-slate-700 border-slate-300 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="categories" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
              <TabsTrigger value="categories" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Categories</TabsTrigger>
              <TabsTrigger value="sizes" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Sizes</TabsTrigger>
              <TabsTrigger value="models" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Models</TabsTrigger>
              <TabsTrigger value="whatsapp" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">WhatsApp</TabsTrigger>
            </TabsList>

            <TabsContent value="categories" className="space-y-6 mt-8">
              <CategoryManager />
            </TabsContent>

            <TabsContent value="sizes" className="space-y-6 mt-8">
              <SizeManager />
            </TabsContent>

            <TabsContent value="models" className="space-y-6 mt-8">
              <ModelManager />
            </TabsContent>

            <TabsContent value="whatsapp" className="space-y-6 mt-8">
              <WhatsAppManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
