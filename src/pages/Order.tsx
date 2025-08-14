
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Package, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  size_value: string;
  model: {
    id: string;
    name: string;
    image_url: string;
  };
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  order_items: OrderItem[];
}

const Order = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            size_value,
            model:models (
              id,
              name,
              image_url
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-orange-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Order Not Found</h2>
            <p className="text-slate-600 mb-6">The order you're looking for doesn't exist.</p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Back to Store
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4">
        <div className="container mx-auto flex items-center">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Store
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Order Details</h1>
            <p className="text-slate-600">Order #{order.id.slice(0, 8)}</p>
          </div>
        </div>
      </div>

      {/* Order Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Order Summary */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardTitle className="flex items-center justify-between">
                <span>Order Summary</span>
                <Badge className={`${getStatusColor(order.status)} flex items-center gap-2`}>
                  {getStatusIcon(order.status)}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Order Information</h3>
                  <p className="text-slate-600">Order ID: #{order.id.slice(0, 8)}</p>
                  <p className="text-slate-600">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                  <p className="text-slate-600">Time: {new Date(order.created_at).toLocaleTimeString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Total Amount</h3>
                  <p className="text-3xl font-bold text-blue-600">${order.total_amount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg"
                  >
                    <img
                      src={item.model.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop"}
                      alt={item.model.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{item.model.name}</h4>
                      <p className="text-slate-600">Size: {item.size_value}</p>
                      <p className="text-slate-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">${item.price}</p>
                      <p className="text-sm text-slate-600">
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Need Help?</h3>
              <p className="text-slate-600 mb-4">
                If you have any questions about your order, please contact us through WhatsApp.
              </p>
              <p className="text-sm text-slate-500">
                Your order will be processed and you'll receive updates via WhatsApp.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Order;
