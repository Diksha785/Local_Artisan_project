import React, { useEffect, useState } from 'react';
import { Package, Clock, Truck, CheckCircle2, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { api } from '../services/api';

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await api.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-64 shimmer-loading rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-4 border-b border-amber-200">
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif">My Order History & Live Tracking</h1>
        <p className="text-xs text-stone-600 font-medium mt-1">
          Monitor fulfillment progress of your handmade rural crafts from artisan workshop to delivery
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-amber-200 p-12 rounded-3xl text-center space-y-4 shadow-xs">
          <Package className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="text-lg font-bold text-stone-900">No Orders Found</h3>
          <p className="text-xs text-stone-500">You have not placed any craft orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order._id;
            return (
              <div
                key={order._id}
                className="bg-white border border-amber-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div
                  onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                  className="p-5 bg-amber-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-amber-100/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-stone-900 text-sm">Order #{order._id}</span>
                      <OrderStatusBadge status={order.orderStatus} />
                    </div>
                    <p className="text-xs text-stone-500">
                      Placed on: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-stone-400 block font-semibold">Total Amount</span>
                      <span className="text-base font-black text-stone-900">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                    </div>

                    <button className="p-1.5 bg-amber-200/80 rounded-full text-stone-800">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details & Tracking Timeline */}
                {isExpanded && (
                  <div className="p-6 border-t border-amber-200 space-y-6 bg-white">
                    {/* Items */}
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs mb-3">Craft Items in this Order:</h4>
                      <div className="space-y-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-amber-50/40 border border-amber-100">
                            <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
                            <div className="flex-1">
                              <h5 className="font-bold text-stone-800 text-xs">{item.title}</h5>
                              <span className="text-[11px] text-stone-500">Qty: {item.quantity} × ₹{item.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Tracking Progress Timeline */}
                    <div className="pt-2">
                      <h4 className="font-bold text-stone-900 text-xs mb-4">Fulfillment Tracking Timeline</h4>
                      
                      <div className="relative border-l-2 border-amber-300 ml-3 space-y-6 pl-6">
                        {order.timeline?.map((step, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-terracotta-600 border-2 border-white shadow"></div>
                            <div>
                              <span className="font-bold text-stone-900 text-xs">{step.status}</span>
                              <p className="text-xs text-stone-600 mt-0.5">{step.note}</p>
                              <span className="text-[10px] text-stone-400 block mt-1">
                                {new Date(step.updatedAt).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
