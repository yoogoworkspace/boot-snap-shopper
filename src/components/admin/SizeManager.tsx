import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Size {
  id: string;
  value: string;
  category_id: string;
  category?: { name: string };
}

interface Category {
  id: string;
  name: string;
}

export const SizeManager = () => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingSize, setEditingSize] = useState<Size | null>(null);
  const [newSize, setNewSize] = useState({ value: "", category_id: "" });

  useEffect(() => {
    fetchSizes();
    fetchCategories();
  }, []);

  const fetchSizes = async () => {
    try {
      const { data, error } = await supabase
        .from('sizes')
        .select(`
          *,
          category:categories(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSizes(data || []);
    } catch (error) {
      console.error('Error fetching sizes:', error);
      toast.error("Failed to load sizes");
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

  const handleAddSize = async () => {
    if (!newSize.value.trim() || !newSize.category_id) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { error } = await supabase
        .from('sizes')
        .insert([newSize]);

      if (error) throw error;
      
      toast.success("Size added successfully");
      setNewSize({ value: "", category_id: "" });
      setIsAdding(false);
      fetchSizes();
    } catch (error) {
      console.error('Error adding size:', error);
      toast.error("Failed to add size");
    }
  };

  const handleUpdateSize = async () => {
    if (!editingSize || !editingSize.value.trim()) {
      toast.error("Size value cannot be empty");
      return;
    }

    try {
      const { error } = await supabase
        .from('sizes')
        .update({ 
          value: editingSize.value,
          category_id: editingSize.category_id
        })
        .eq('id', editingSize.id);

      if (error) throw error;
      
      toast.success("Size updated successfully");
      setEditingSize(null);
      fetchSizes();
    } catch (error) {
      console.error('Error updating size:', error);
      toast.error("Failed to update size");
    }
  };

  const handleDeleteSize = async (id: string) => {
    if (!confirm("Are you sure you want to delete this size? This will also delete all associated models.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('sizes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Size deleted successfully");
      fetchSizes();
    } catch (error) {
      console.error('Error deleting size:', error);
      toast.error("Failed to delete size");
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <span>Size Management</span>
          <Button 
            onClick={() => setIsAdding(true)}
            className="bg-white text-blue-600 hover:bg-blue-50"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Size
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isAdding && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="size-value">Size Value</Label>
                  <Input
                    id="size-value"
                    value={newSize.value}
                    onChange={(e) => setNewSize({ ...newSize, value: e.target.value })}
                    placeholder="e.g., 42, 10, XL"
                  />
                </div>
                <div>
                  <Label htmlFor="size-category">Category</Label>
                  <Select value={newSize.category_id} onValueChange={(value) => setNewSize({ ...newSize, category_id: value })}>
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
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddSize} className="bg-green-600 hover:bg-green-700">
                  Add Size
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {sizes.map((size) => (
            <Card key={size.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {editingSize?.id === size.id ? (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      value={editingSize.value}
                      onChange={(e) => setEditingSize({ ...editingSize, value: e.target.value })}
                    />
                    <Select 
                      value={editingSize.category_id} 
                      onValueChange={(value) => setEditingSize({ ...editingSize, category_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="col-span-2 flex space-x-2">
                      <Button onClick={handleUpdateSize} size="sm" className="bg-green-600 hover:bg-green-700">
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setEditingSize(null)} size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-lg">{size.value}</span>
                      <span className="text-slate-600 ml-3">({size.category?.name})</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSize(size)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSize(size.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
