import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, ExternalLink, Star, Leaf } from 'lucide-react';
import { api } from '../services/api';

export default function ArtisanProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getMyArtisanProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this craft listing?')) return;

    try {
      await api.deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="h-64 shimmer-loading rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 font-serif">My Craft Listings Catalog</h1>
          <p className="text-xs text-stone-600 font-medium mt-1">
            Add, update, or remove your handmade products available on the marketplace
          </p>
        </div>

        <Link
          to="/artisan/products/new"
          className="bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Product</span>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-amber-200 p-12 rounded-3xl text-center space-y-4 shadow-xs">
          <h3 className="text-lg font-bold text-stone-900">No Listings Added Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Create your first digital craft listing with photos and voice description.
          </p>
          <Link
            to="/artisan/products/new"
            className="inline-block bg-terracotta-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow"
          >
            Create Product Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white border border-amber-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="relative aspect-video overflow-hidden bg-amber-50">
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-md text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Stock: {product.stock}
                </span>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-terracotta-600 block">{product.category}</span>
                  <h3 className="font-bold text-stone-900 text-sm line-clamp-1">{product.title}</h3>
                  <span className="text-lg font-black text-stone-900 block mt-1">₹{product.price.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-3 border-t border-amber-100 flex items-center justify-between">
                  <Link
                    to={`/products/${product._id}`}
                    target="_blank"
                    className="text-stone-500 hover:text-terracotta-600 p-1 text-xs font-semibold flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Preview
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/artisan/products/edit/${product._id}`}
                      className="p-2 text-stone-700 hover:text-terracotta-600 hover:bg-amber-100 rounded-lg transition-colors"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
