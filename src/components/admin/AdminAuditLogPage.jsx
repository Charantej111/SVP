import React, { useState, useMemo } from 'react';
import { History, Search, ArrowUpRight, ArrowDownRight, ShieldCheck, Filter } from 'lucide-react';

export const AdminAuditLogPage = ({ movements = [], products = [] }) => {
  const [search, setSearch] = useState('');

  const enrichedMovements = useMemo(() => {
    return movements.map(m => {
      const prod = products.find(p => p.id === m.product_id);
      return {
        ...m,
        product_name: prod ? `${prod.brand} ${prod.name}` : m.product_id,
        pack_size: prod?.pack_size || ''
      };
    });
  }, [movements, products]);

  const filteredMovements = useMemo(() => {
    if (!search.trim()) return enrichedMovements;
    const q = search.toLowerCase().trim();
    return enrichedMovements.filter(m => 
      m.product_name?.toLowerCase().includes(q) ||
      m.reason?.toLowerCase().includes(q) ||
      m.admin_email?.toLowerCase().includes(q)
    );
  }, [enrichedMovements, search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Inventory Movement Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Immutable historical record of every stock modification, delta change, and staff attribution
          </p>
        </div>
      </div>

      {/* Search Filter Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit records by product, admin email, or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 focus:border-brand-800 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-800 font-medium"
          />
        </div>
      </div>

      {/* Movements Audit Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[11px] font-black tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Product Item</th>
                <th className="py-3.5 px-4 text-center">Change Delta</th>
                <th className="py-3.5 px-4">Stock Progression</th>
                <th className="py-3.5 px-4">Reason / Notes</th>
                <th className="py-3.5 px-4 text-right">Staff Author</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    No movement audit records found.
                  </td>
                </tr>
              ) : (
                filteredMovements.map((m) => {
                  const isPositive = m.change_quantity > 0;
                  const formattedDate = new Date(m.created_at).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  });

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Date & Time */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* Product */}
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900">
                          {m.product_name}
                        </div>
                        {m.pack_size && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            {m.pack_size}
                          </div>
                        )}
                      </td>

                      {/* Change Delta */}
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 font-mono font-black px-2.5 py-1 rounded-xl text-xs ${
                          isPositive
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" /> : <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />}
                          <span>{isPositive ? `+${m.change_quantity}` : m.change_quantity}</span>
                        </span>
                      </td>

                      {/* Stock Progression */}
                      <td className="py-3 px-4 font-mono text-xs text-slate-500">
                        {m.previous_quantity} → <strong className="text-slate-900 font-black">{m.new_quantity}</strong>
                      </td>

                      {/* Reason */}
                      <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                        {m.reason}
                      </td>

                      {/* Admin Email */}
                      <td className="py-3 px-4 text-right">
                        <span className="text-[11px] font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                          {m.admin_email || 'Store Staff'}
                        </span>
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
