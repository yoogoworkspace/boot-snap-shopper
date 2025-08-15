import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Model {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category_id: string;
  size_id: string;
  category?: { name: string };
  size?: { value: string };
}

interface Category {
  id: string;
  name: string;
}

interface Size {
  id: string;
  value: string;
  category_id: string;
}

export const ModelManager = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [filteredSizes, setFilteredSizes] = useState<Size[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [newModel, setNewModel] = useState({ 
    name: "", 
    price: "", 
    image_url: "", 
    category_id: "", 
    size_id: "" 
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchModels();
    fetchCategories();
    fetchSizes();
  }, []);

  useEffect(() => {
    if (newModel.category_id) {
      const filtered = sizes.filter(size => size.category_id === newModel.category_id);
      // Sort sizes numerically
      filtered.sort((a, b) => {
        const aNum = parseFloat(a.value);
        const bNum = parseFloat(b.value);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }
        return a.value.localeCompare(b.value);
      });
      setFilteredSizes(filtered);
    }
  }, [newModel.category_id, sizes]);

  const fetchModels = async () => {
    try {
      const { data, error } = await supabase
        .from('models')
        .select(`
          *,
          category:categories(name),
          size:sizes(value)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setModels(data || []);
    } catch (error) {
      console.error('Error fetching models:', error);
      toast.error("Failed to load models");
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSizes = async () => {
    try {
      const { data, error } = await supabase
        .from('sizes')
        .select('*');

      if (error) throw error;
      
      // Sort sizes numerically
      const sortedSizes = (data || []).sort((a, b) => {
        const aNum = parseFloat(a.value);
        const bNum = parseFloat(b.value);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }
        return a.value.localeCompare(b.value);
      });
      
      setSizes(sortedSizes);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload without RLS restrictions since storage bucket is public
      const { error: uploadError } = await supabase.storage
        .from('model-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('model-images')
        .getPublicUrl(fileName);

      setNewModel({ ...newModel, image_url: publicUrl });
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddModel = async () => {
    if (!newModel.name.trim() || !newModel.price || !newModel.category_id || !newModel.size_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { error } = await supabase
        .from('models')
        .insert([{
          ...newModel,
          price: parseFloat(newModel.price)
        }]);

      if (error) throw error;
      
      toast.success("Model added successfully");
      setNewModel({ name: "", price: "", image_url: "", category_id: "", size_id: "" });
      setIsAdding(false);
      fetchModels();
    } catch (error) {
      console.error('Error adding model:', error);
      toast.error("Failed to add model");
    }
  };

  const handleDeleteModel = async (id: string) => {
    if (!confirm("Are you sure you want to delete this model?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('models')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Model deleted successfully");
      fetchModels();
    } catch (error) {
      console.error('Error deleting model:', error);
      toast.error("Failed to delete model");
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <span>Model Management</span>
          <Button 
            onClick={() => setIsAdding(true)}
            className="bg-white text-blue-600 hover:bg-blue-50"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Model
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isAdding && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="model-name">Model Name *</Label>
                  <Input
                    id="model-name"
                    value={newModel.name}
                    onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                    placeholder="e.g., Nike Air Max"
                  />
                </div>
                <div>
                  <Label htmlFor="model-price">Price *</Label>
                  <Input
                    id="model-price"
                    type="number"
                    step="0.01"
                    value={newModel.price}
                    onChange={(e) => setNewModel({ ...newModel, price: e.target.value })}
                    placeholder="99.99"
                  />
                </div>
                <div>
                  <Label htmlFor="model-category">Category *</Label>
                  <Select value={newModel.category_id} onValueChange={(value) => setNewModel({ ...newModel, category_id: value, size_id: "" })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="model-size">Size *</Label>
                  <Select value={newModel.size_id} onValueChange={(value) => setNewModel({ ...newModel, size_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="model-image">Model Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="flex-1"
                    />
                    {uploading && (
                      <div className="text-sm text-blue-600">Uploading...</div>
                    )}
                  </div>
                  {newModel.image_url && (
                    <div className="mt-2 relative inline-block">
                      <img 
                        src={newModel.image_url} 
                        alt="Preview" 
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={() => setNewModel({ ...newModel, image_url: "" })}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddModel} className="bg-green-600 hover:bg-green-700" disabled={uploading}>
                  Add Model
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {models.map((model) => (
            <Card key={model.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {model.image_url && (
                      <img 
                        src={model.image_url} 
                        alt={model.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{model.name}</h3>
                      <p className="text-blue-600 font-bold">${model.price}</p>
                      <p className="text-sm text-slate-600">
                        {model.category?.name} - Size {model.size?.value}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteModel(model.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
