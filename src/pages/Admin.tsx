
import { ArrowLeft, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { WhatsAppManager } from "@/components/admin/WhatsAppManager";

const Admin = () => {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-card-foreground">
              Admin Panel
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          <Tabs defaultValue="categories" className="w-full animate-fade-in">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="sizes">Sizes</TabsTrigger>
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            </TabsList>

            <TabsContent value="categories" className="space-y-6">
              <CategoryManager />
            </TabsContent>

            <TabsContent value="sizes" className="space-y-6">
              <div className="text-center p-8 text-muted-foreground">
                Size management coming soon...
              </div>
            </TabsContent>

            <TabsContent value="models" className="space-y-6">
              <div className="text-center p-8 text-muted-foreground">
                Model management coming soon...
              </div>
            </TabsContent>

            <TabsContent value="whatsapp" className="space-y-6">
              <WhatsAppManager />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Admin;
