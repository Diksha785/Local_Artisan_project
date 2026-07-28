import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, TrendingUp, ShoppingBag, Clock, CheckCircle2, Star, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import OrderStatusBadge from '../components/OrderStatusBadge';
import SalesTrendChart from '../components/SalesTrendChart';
import TopProductsChart from '../components/TopProductsChart';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ArtisanDashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const stats = await api.getArtisanAnalytics();
      setAnalytics(stats);

      const ordList = await api.getArtisanOrders();
      setOrders(ordList);

      const prodList = await api.getMyArtisanProducts();
      setMyProducts(prodList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.updateOrderStatus(orderId, {
        status: newStatus,
        note: `Order status updated to ${newStatus} by artisan`
      });
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Status update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-96 shimmer-loading rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-200">
        <div>
          <span className="text-xs font-bold text-terracotta-600 uppercase tracking-widest">Artisan Studio</span>
          <h1 className="text-3xl font-extrabold text-stone-900 font-serif">
            Welcome, {user?.name || 'Sunita Devi'} 👋
          </h1>
          <p className="text-xs text-stone-600 font-medium mt-1">
            Manage your handmade craft catalog, track customer orders, and view sales revenue
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/artisan/products"
            className="bg-white hover:bg-amber-100 border border-amber-300 text-stone-900 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
          >
            Manage Craft Listings
          </Link>
          <Link
            to="/artisan/products/new"
            className="bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white border border-amber-200 p-6 rounded-3xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-terracotta-600">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Revenue</span>
            <div className="p-2 bg-terracotta-50 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-stone-900 block">
            ₹{analytics?.totalRevenue?.toLocaleString('en-IN') || 0}
          </span>
          <p className="text-[11px] text-stone-400 font-medium">Direct earnings from sales</p>
        </div>

        <div className="bg-white border border-amber-200 p-6 rounded-3xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Pending Orders</span>
            <div className="p-2 bg-amber-50 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-stone-900 block">
            {analytics?.pendingOrders || 0}
          </span>
          <p className="text-[11px] text-stone-400 font-medium">Requires dispatch packing</p>
        </div>

        <div className="bg-white border border-amber-200 p-6 rounded-3xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Active Listings</span>
            <div className="p-2 bg-emerald-50 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-stone-900 block">
            {myProducts.length || 0}
          </span>
          <p className="text-[11px] text-stone-400 font-medium">Live on marketplace</p>
        </div>

        <div className="bg-white border border-amber-200 p-6 rounded-3xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-purple-600">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Artisan Rating</span>
            <div className="p-2 bg-purple-50 rounded-xl">
              <Star className="w-5 h-5 fill-purple-400 text-purple-400" />
            </div>
          </div>
          <span className="text-3xl font-black text-stone-900 block">
            {analytics?.averageRating || 4.9} / 5.0
          </span>
          <p className="text-[11px] text-stone-400 font-medium">Based on buyer feedback</p>
        </div>

      </div>

      {/* Visual Analytics Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SalesTrendChart data={analytics?.monthlyRevenue} />
        <TopProductsChart products={analytics?.topProducts} />
      </section>

      {/* Orders Management Table */}
      <section className="bg-white border border-amber-200 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-amber-100 pb-4">
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-xl">Customer Craft Orders</h3>
            <p className="text-xs text-stone-500 mt-0.5">Update fulfillment status for your buyers</p>
          </div>
          <button
            onClick={loadDashboardData}
            className="p-2 text-stone-600 hover:text-terracotta-600 hover:bg-amber-50 rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-stone-500 italic text-center py-6">No customer orders received yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-amber-200 text-[11px] uppercase font-bold text-stone-500 bg-amber-50/50">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Buyer Name</th>
                  <th className="p-3">Craft Items</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Update Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 text-xs font-semibold text-stone-800">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="p-3 font-mono font-bold text-stone-900">#{order._id}</td>
                    <td className="p-3">
                      <div>
                        <span className="block font-bold">{order.buyerName}</span>
                        <span className="text-[10px] text-stone-400">{order.shippingAddress?.city}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      {order.items?.map((item, idx) => (
                        <span key={idx} className="block line-clamp-1">
                          {item.title} (x{item.quantity})
                        </span>
                      ))}
                    </td>
                    <td className="p-3 font-bold text-terracotta-600">₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <OrderStatusBadge status={order.orderStatus} />
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={order.orderStatus}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="bg-amber-50 border border-amber-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-800 outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing / Crafting</option>
                        <option value="Shipped">Dispatched / Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}
