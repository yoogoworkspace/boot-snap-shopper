
import { ArrowLeft, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { SizeManager } from "@/components/admin/SizeManager";
import { ModelManager } from "@/components/admin/ModelManager";
import { WhatsAppManager } from "@/components/admin/WhatsAppManager";
import { useState } from "react";
import { toast } from "sonner";

const Admin = () => {
  const { signOut, user, signIn, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSigningIn(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message || "Invalid credentials");
      } else {
        toast.success("Signed in successfully!");
      }
    } catch (error) {
      toast.error("An error occurred during sign in");
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Access
            </CardTitle>
            <p className="text-slate-600 mt-2">
              Sign in to access the admin panel
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-700 font-medium">Username</Label>
                <Input
                  id="username"
                  type="text" // changed from email to text
                  placeholder="Enter your username"
                  value={email} // still using email state variable to avoid changing auth logic
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isSigningIn}
              >
                {isSigningIn ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-6 pt-6 border-t border-slate-200">
              <Link to="/">
                <Button variant="ghost" className="w-full text-slate-600 hover:text-slate-900">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Store
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
