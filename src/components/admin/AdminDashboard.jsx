import React from 'react';
import { 
  Package, 
  Boxes, 
  AlertTriangle, 
  XCircle, 
  PlusCircle, 
  ArrowRight, 
  History, 
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export const AdminDashboard = ({ 
  products = [], 
  inventory = [], 
  movements = [], 
  onNavigateTab, 
  onOpenNewProduct, 
  onOpenAdjustStock 
}) => {
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.is_active !== false).length;
  const outOfStockCount = inventory.filter(i => (i.stock_quantity || 0) === 0).length;
  const lowStockCount = inventory.filter(i => (i.stock_quantity || 0) > 0 && (i.stock_quantity || 0) <= (i.low_stock_threshold || 5)).length;
  const inStockCount = inventory.filter(i => (i.stock_quantity || 0) > (i.low_stock_threshold || 5)).length;

  const lowStockItems = inventory
    .filter(i => (i.stock_quantity || 0) <= (i.low_stock_threshold || 5))
    .slice(0, 5);

  const recentMovements = movements.slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Store Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Sri Prasanna Vigneswara Superbazaar • Real-time catalog & stock metrics
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenNewProduct}
            className="px-4 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-subtle transition-all cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </button>

          <button
            onClick={() => onNavigateTab('inventory')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <Boxes className="w-4 h-4 text-brand-800" />
            <span>Manage Stock</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Total Products */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Catalog Items</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalProducts}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{activeProducts} Active on storefront</div>
          </div>
        </div>

        {/* Card 2: Healthy Stock */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Healthy Stock</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-800">{inStockCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Above low-stock threshold</div>
          </div>
        </div>

        {/* Card 3: Low Stock Warning */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Low Stock</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-700">{lowStockCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">≤ 5 units remaining</div>
          </div>
        </div>

        {/* Card 4: Out of Stock */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Out of Stock</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-rose-700">{outOfStockCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Needs replenishment</div>
          </div>
        </div>

      </div>

      {/* Two Column Layout: Low Stock Watchlist & Recent Movement Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Low Stock Alerts */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Low & Out of Stock Watchlist
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-xs font-extrabold text-brand-800 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs font-medium">
              ✓ All products have sufficient warehouse stock.
            </div>
          ) : (
            <div className="space-y-2.5">
              {lowStockItems.map((item) => {
                const product = products.find(p => p.id === item.product_id);
                const isZero = (item.stock_quantity || 0) === 0;
                return (
                  <div 
                    key={item.product_id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {product?.brand} {product?.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {product?.pack_size} • {product?.price ? formatPrice(product.price) : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                        isZero ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {item.stock_quantity || 0} Units
                      </span>

                      <button
                        onClick={() => onOpenAdjustStock(item.product_id)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-brand-50 border border-slate-200 text-brand-800 hover:border-brand-300 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        Adjust
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Recent Movement Audit Log */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-brand-800" />
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Recent Stock Audits
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('history')}
              className="text-xs font-extrabold text-brand-800 hover:underline cursor-pointer"
            >
              Full Log
            </button>
          </div>

          {recentMovements.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs font-medium">
              No stock movements recorded yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentMovements.map((m) => {
                const product = products.find(p => p.id === m.product_id);
                const isPositive = m.change_quantity > 0;
                return (
                  <div 
                    key={m.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate max-w-[160px]">
                        {product ? `${product.brand} ${product.name}` : m.product_id}
                      </span>
                      <span className={`font-mono font-black ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {isPositive ? `+${m.change_quantity}` : m.change_quantity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="truncate max-w-[150px]">{m.reason}</span>
                      <span>{m.previous_quantity} → <strong className="text-slate-900">{m.new_quantity}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
