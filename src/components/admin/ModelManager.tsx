import { useState, useEffect } from "react";
import { Plus, Edit, X, Eye, EyeOff } from "lucide-react";
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
  is_hidden: boolean;
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
  const [filteredSizes, setFilteredSizes] = useState<Size[]>([]); // for add/edit form
  const [filterSizes, setFilterSizes] = useState<Size[]>([]); // for filters
  const [isAdding, setIsAdding] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [newModel, setNewModel] = useState({
    name: "",
    price: "",
    image_url: "",
    category_id: "" as string,
    size_id: "" as string,
  });
  const [uploading, setUploading] = useState(false);
  const [filters, setFilters] = useState<{ category_id?: string; size_id?: string }>({});

  // Fetch initial data
  useEffect(() => {
    fetchModels();
    fetchCategories();
    fetchSizes();
  }, []);

  // Filter sizes for add/edit form
  useEffect(() => {
    if (newModel.category_id) {
      const filtered = sizes
        .filter((size) => size.category_id === newModel.category_id)
        .sort((a, b) => {
          const aNum = parseFloat(a.value);
          const bNum = parseFloat(b.value);
          if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
          return a.value.localeCompare(b.value);
        });
      setFilteredSizes(filtered);
    } else {
      setFilteredSizes([]);
    }
  }, [newModel.category_id, sizes]);

  // Filter sizes for filters
  useEffect(() => {
    if (filters.category_id) {
      const filtered = sizes
        .filter((size) => size.category_id === filters.category_id)
        .sort((a, b) => {
          const aNum = parseFloat(a.value);
          const bNum = parseFloat(b.value);
          if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
          return a.value.localeCompare(b.value);
        });
      setFilterSizes(filtered);
    } else {
      setFilterSizes([]);
    }
  }, [filters.category_id, sizes]);

  const fetchModels = async () => {
    try {
      const { data, error } = await supabase
        .from("models")
        .select("*, category:categories(name), size:sizes(value)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setModels(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load models");
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSizes = async () => {
    try {
      const { data, error } = await supabase.from("sizes").select("*");
      if (error) throw error;
      const sorted = (data || []).sort((a, b) => {
        const aNum = parseFloat(a.value);
        const bNum = parseFloat(b.value);
        if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
        return a.value.localeCompare(b.value);
      });
      setSizes(sorted);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return toast.error("Please select an image file");
    if (file.size > 10 * 1024 * 1024) return toast.error("Image size should be < 10MB");

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("model-images").upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data, error: urlError } = supabase.storage.from("model-images").getPublicUrl(fileName);
      if (urlError || !data?.publicUrl) throw urlError || new Error("No URL returned");

      setNewModel({ ...newModel, image_url: data.publicUrl });
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddModel = async () => {
    if (!newModel.name || !newModel.price || !newModel.category_id || !newModel.size_id)
      return toast.error("Fill all fields");
    try {
      const { error } = await supabase.from("models").insert([
        { ...newModel, price: parseFloat(newModel.price) },
      ]);
      if (error) throw error;
      toast.success("Model added!");
      resetForm();
      fetchModels();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add model");
    }
  };

  const handleEditModel = (model: Model) => {
    setEditingModel(model);
    setNewModel({
      name: model.name,
      price: model.price.toString(),
      image_url: model.image_url,
      category_id: model.category_id || "",
      size_id: model.size_id || "",
    });
    setIsAdding(true);
  };

  const handleUpdateModel = async () => {
    if (!editingModel) return;
    if (!newModel.name || !newModel.price || !newModel.category_id || !newModel.size_id)
      return toast.error("Fill all fields");
    try {
      const { error } = await supabase
        .from("models")
        .update({ ...newModel, price: parseFloat(newModel.price) })
        .eq("id", editingModel.id);
      if (error) throw error;
      toast.success("Model updated!");
      resetForm();
      fetchModels();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update model");
    }
  };

  const handleToggleHideModel = async (id: string, hidden: boolean) => {
    try {
      const { error } = await supabase.from("models").update({ is_hidden: !hidden }).eq("id", id);
      if (error) throw error;
      toast.success(!hidden ? "Model hidden" : "Model visible");
      fetchModels();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update visibility");
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingModel(null);
    setNewModel({ name: "", price: "", image_url: "", category_id: "", size_id: "" });
  };

  const filteredModels = models.filter(
    (m) =>
      (!filters.category_id || m.category_id === filters.category_id) &&
      (!filters.size_id || m.size_id === filters.size_id)
  );

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <span>Model Management</span>
          <Button onClick={() => setIsAdding(true)} className="bg-white text-blue-600 hover:bg-blue-50" size="sm">
            <Plus className="h-4 w-4 mr-2" /> Add Model
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <Select
            value={filters.category_id || ""}
            onValueChange={(value) => setFilters({ category_id: value, size_id: undefined })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.size_id || ""}
            onValueChange={(value) => setFilters({ ...filters, size_id: value })}
            disabled={!filters.category_id}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Size" />
            </SelectTrigger>
            <SelectContent>
              {filterSizes.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4 grid grid-cols-2 gap-4">
              {/* Name & Price */}
              <div>
                <Label>Model Name *</Label>
                <Input
                  value={newModel.name}
                  onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Price *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newModel.price}
                  onChange={(e) => setNewModel({ ...newModel, price: e.target.value })}
                />
              </div>

              {/* Category & Size */}
              <div>
                <Label>Category *</Label>
                <Select
                  value={newModel.category_id || ""}
                  onValueChange={(value) =>
                    setNewModel({ ...newModel, category_id: value, size_id: "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Size *</Label>
                <Select
                  value={newModel.size_id || ""}
                  onValueChange={(value) => setNewModel({ ...newModel, size_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Size" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSizes.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image */}
              <div className="col-span-2">
                <Label>Model Image</Label>
                <div className="flex items-center gap-4">
                  <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  {uploading && <span className="text-blue-600">Uploading...</span>}
                </div>
                {newModel.image_url && (
                  <div className="relative inline-block mt-2">
                    <img src={newModel.image_url} alt="Preview" className="w-20 h-20 object-cover rounded border" />
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

              {/* Buttons */}
              <div className="col-span-2 flex space-x-2 mt-2">
                <Button
                  onClick={editingModel ? handleUpdateModel : handleAddModel}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={uploading}
                >
                  {editingModel ? "Update Model" : "Add Model"}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Model List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModels.map((m) => (
            <Card key={m.id} className="shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center p-4">
              {m.image_url && (
                <img src={m.image_url} alt={m.name} className="w-32 h-32 object-cover rounded-lg mb-2" />
              )}
              <h3 className="font-semibold text-lg">{m.name}</h3>
              {m.is_hidden && <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">Hidden</span>}
              <p className="text-blue-600 font-bold">₹{m.price}</p>
              <p className="text-sm text-slate-600">{m.category?.name || "-"} - Size {m.size?.value || "-"}</p>
              <div className="flex space-x-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditModel(m)}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleHideModel(m.id, m.is_hidden)}
                  className={m.is_hidden ? "text-green-600 border-green-200 hover:bg-green-50" : "text-yellow-600 border-yellow-200 hover:bg-yellow-50"}
                >
                  {m.is_hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
