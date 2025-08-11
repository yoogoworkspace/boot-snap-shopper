
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
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
            Admin Panel
          </h1>
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
              <Card className="animate-slide-up">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Category Management</CardTitle>
                    <Button className="btn-accent">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Football Boots", "Running & Formal Shoes"].map((category) => (
                      <div key={category} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <span className="font-medium">{category}</span>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sizes" className="space-y-6">
              <Card className="animate-slide-up">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Size Management</CardTitle>
                    <Button className="btn-accent">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Size
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Size management interface will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="models" className="space-y-6">
              <Card className="animate-slide-up">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Model Management</CardTitle>
                    <Button className="btn-accent">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Model
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Model management interface will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="whatsapp" className="space-y-6">
              <Card className="animate-slide-up">
                <CardHeader>
                  <CardTitle>WhatsApp Account Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">WhatsApp account configuration will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Admin;
