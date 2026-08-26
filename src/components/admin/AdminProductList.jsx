import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  Search, 
  Edit3, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  XCircle, 
  Filter 
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { DEPARTMENTS } from '../../data/categoriesData';

export const AdminProductList = ({ 
  products = [], 
  inventory = [],
  onOpenNewProduct, 
  onEditProduct, 
  onToggleActive 
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matches = (
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.pack_size?.toLowerCase().includes(q) ||
          p.id?.toLowerCase().includes(q)
        );
        if (!matches) return false;
      }

      // Category
      if (selectedCategory !== 'all' && p.category_id !== selectedCategory) {
        return false;
      }

      // Status
      if (statusFilter === 'active' && p.is_active === false) return false;
      if (statusFilter === 'inactive' && p.is_active !== false) return false;

      return true;
    });
  }, [products, search, selectedCategory, statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Products Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage product descriptions, pricing, departments, and active storefront visibility
          </p>
        </div>

        <button
          onClick={onOpenNewProduct}
          className="px-5 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-subtle transition-all cursor-pointer active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Toolbar: Search, Filters */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-2xs">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name, brand, or pack size..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 focus:border-brand-800 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-800 font-medium"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 text-xs">
          
          {/* Department Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-brand-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories ({products.length})
            </button>

            {DEPARTMENTS.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedCategory(d.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === d.id
                    ? 'bg-brand-800 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {d.shortName}
              </button>
            ))}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                statusFilter === 'active' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-500'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                statusFilter === 'inactive' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-500'
              }`}
            >
              Disabled
            </button>
          </div>

        </div>

      </div>

      {/* Products Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[11px] font-black tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Pack Size</th>
                <th className="py-3.5 px-4">Price / MRP</th>
                <th className="py-3.5 px-4 text-center">Store Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    No products found matching your search or filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const dept = DEPARTMENTS.find(d => d.id === p.category_id);
                  const isActive = p.is_active !== false;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Product Name & Image */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-200"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-brand-800 font-semibold">
                              {p.brand}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4 text-slate-500">
                        {dept?.shortName || p.category_id}
                      </td>

                      {/* Pack Size */}
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {p.pack_size}
                      </td>

                      {/* Price / MRP */}
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900 font-mono">
                          {formatPrice(p.price)}
                        </div>
                        {p.mrp && p.mrp > p.price && (
                          <div className="text-[10px] text-slate-400 line-through font-mono">
                            MRP {formatPrice(p.mrp)}
                          </div>
                        )}
                      </td>

                      {/* Store Status Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onToggleActive(p.id, !isActive)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                          title="Click to toggle visibility on public store"
                        >
                          {isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{isActive ? 'Active' : 'Disabled'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onEditProduct(p)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-800 transition-colors cursor-pointer border border-transparent hover:border-brand-200"
                          title="Edit product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
