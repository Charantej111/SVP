import React, { useState, useMemo } from 'react';
import { 
  Boxes, 
  Search, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2 
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/categoriesData';

export const AdminInventoryPage = ({ 
  products = [], 
  inventory = [], 
  onOpenAdjustStock 
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'

  // Combine products with inventory data
  const combinedInventory = useMemo(() => {
    return products.map(product => {
      const inv = inventory.find(i => i.product_id === product.id);
      const stock = inv?.stock_quantity ?? 0;
      const threshold = inv?.low_stock_threshold ?? 5;

      let status = 'in_stock';
      if (stock === 0) {
        status = 'out_of_stock';
      } else if (stock <= threshold) {
        status = 'low_stock';
      }

      return {
        ...product,
        stock_quantity: stock,
        low_stock_threshold: threshold,
        inventory_status: status
      };
    });
  }, [products, inventory]);

  const filteredInventory = useMemo(() => {
    return combinedInventory.filter(item => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matches = (
          item.name?.toLowerCase().includes(q) ||
          item.brand?.toLowerCase().includes(q) ||
          item.pack_size?.toLowerCase().includes(q)
        );
        if (!matches) return false;
      }

      // Category
      if (selectedCategory !== 'all' && item.category_id !== selectedCategory) {
        return false;
      }

      // Status
      if (statusFilter !== 'all' && item.inventory_status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [combinedInventory, search, selectedCategory, statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Inventory & Stock Levels
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Monitor real-time warehouse counts, low stock alerts, and perform instant adjustments
          </p>
        </div>
      </div>

      {/* Toolbar: Search, Filters */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-2xs">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items by product or brand name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 focus:border-brand-800 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-800 font-medium"
          />
        </div>

        {/* Filters */}
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
              All Departments
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
              All ({combinedInventory.length})
            </button>
            <button
              onClick={() => setStatusFilter('in_stock')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                statusFilter === 'in_stock' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-500'
              }`}
            >
              In Stock
            </button>
            <button
              onClick={() => setStatusFilter('low_stock')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                statusFilter === 'low_stock' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-500'
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setStatusFilter('out_of_stock')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                statusFilter === 'out_of_stock' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-500'
              }`}
            >
              Out of Stock
            </button>
          </div>

        </div>

      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[11px] font-black tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Item & Brand</th>
                <th className="py-3.5 px-4">Pack Size</th>
                <th className="py-3.5 px-4">Threshold</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    No inventory items found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isZero = item.stock_quantity === 0;
                  const isLow = item.inventory_status === 'low_stock';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Product details */}
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-brand-800 font-semibold">
                          {item.brand}
                        </div>
                      </td>

                      {/* Pack Size */}
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {item.pack_size}
                      </td>

                      {/* Threshold */}
                      <td className="py-3 px-4 font-mono text-slate-400">
                        ≤ {item.low_stock_threshold} Units
                      </td>

                      {/* Current Stock */}
                      <td className="py-3 px-4">
                        <span className={`font-mono text-sm font-black ${
                          isZero ? 'text-rose-700' : isLow ? 'text-amber-700' : 'text-slate-900'
                        }`}>
                          {item.stock_quantity} Units
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          isZero
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : isLow
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {isZero ? (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Out of Stock</span>
                            </>
                          ) : isLow ? (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              <span>Low Stock</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>In Stock</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onOpenAdjustStock(item.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-50 text-brand-800 hover:text-brand-900 border border-slate-200 hover:border-brand-300 font-bold text-xs transition-colors cursor-pointer shadow-2xs active:scale-95"
                        >
                          Update Stock
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
