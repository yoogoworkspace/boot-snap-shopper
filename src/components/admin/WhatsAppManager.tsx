
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WhatsAppAccount {
  id: string;
  phone_number: string;
  account_name: string;
  is_active: boolean;
  last_used: string;
}

export function WhatsAppManager() {
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<WhatsAppAccount | null>(null);
  const [formData, setFormData] = useState({
    phone_number: "",
    account_name: "",
    is_active: true
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_accounts')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      toast.error("Failed to fetch WhatsApp accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAccount) {
        const { error } = await supabase
          .from('whatsapp_accounts')
          .update(formData)
          .eq('id', editingAccount.id);
        
        if (error) throw error;
        toast.success("WhatsApp account updated successfully");
      } else {
        const { error } = await supabase
          .from('whatsapp_accounts')
          .insert([formData]);
        
        if (error) throw error;
        toast.success("WhatsApp account created successfully");
      }
      
      setDialogOpen(false);
      setEditingAccount(null);
      setFormData({ phone_number: "", account_name: "", is_active: true });
      fetchAccounts();
    } catch (error: any) {
      toast.error(error.message || "Failed to save WhatsApp account");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this WhatsApp account?")) return;
    
    try {
      const { error } = await supabase
        .from('whatsapp_accounts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success("WhatsApp account deleted successfully");
      fetchAccounts();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete WhatsApp account");
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('whatsapp_accounts')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      toast.success("Account status updated");
      fetchAccounts();
    } catch (error: any) {
      toast.error("Failed to update account status");
    }
  };

  const openDialog = (account?: WhatsAppAccount) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        phone_number: account.phone_number,
        account_name: account.account_name,
        is_active: account.is_active
      });
    } else {
      setEditingAccount(null);
      setFormData({ phone_number: "", account_name: "", is_active: true });
    }
    setDialogOpen(true);
  };

  if (loading) {
    return <div className="animate-pulse">Loading WhatsApp accounts...</div>;
  }

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>WhatsApp Account Management</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-accent" onClick={() => openDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add WhatsApp Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingAccount ? "Edit WhatsApp Account" : "Add New WhatsApp Account"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    placeholder="+1234567890"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_name">Account Name</Label>
                  <Input
                    id="account_name"
                    value={formData.account_name}
                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                    placeholder="Support Team"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingAccount ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{account.phone_number}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      account.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {account.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {account.account_name && (
                    <p className="text-sm text-muted-foreground">{account.account_name}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={account.is_active}
                  onCheckedChange={() => toggleActive(account.id, account.is_active)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDialog(account)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleDelete(account.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
