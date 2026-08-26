import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Boxes, 
  History, 
  LogOut, 
  Store, 
  Menu, 
  X, 
  ShieldCheck, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout = ({ activeTab, setActiveTab, onExitAdmin, children }) => {
  const { user, logout, isConfigured } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products Catalog', icon: Package },
    { id: 'inventory', label: 'Inventory & Stock', icon: Boxes },
    { id: 'history', label: 'Audit History', icon: History }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col md:flex-row font-sans selection:bg-brand-100 selection:text-brand-900">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-slate-200/90 p-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <img 
            src="/logo.png" 
            alt="SPV Super Bazaar" 
            className="h-8 w-auto object-contain"
          />
          <div>
            <div className="font-extrabold text-sm text-slate-900 leading-none">SPV Admin</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Control Center</div>
          </div>
        </div>

        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
        >
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 z-40 h-screen w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between p-5 transition-transform duration-300 shrink-0 shadow-2xs
        ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6">
          
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2">
            <img 
              src="/logo.png" 
              alt="SPV Super Bazaar" 
              className="h-9 w-auto object-contain"
            />
            <div>
              <div className="font-extrabold text-sm text-slate-900 tracking-tight leading-tight">SPV Super Bazaar</div>
              <div className="text-[11px] text-brand-800 font-bold uppercase tracking-wider">Store Admin</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-[13px] transition-all cursor-pointer ${
                    isActive
                      ? 'bg-brand-800 text-white shadow-sm font-extrabold'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Bottom Sidebar: Admin Profile & Actions */}
        <div className="space-y-2.5 pt-4 border-t border-slate-100">
          
          {/* Admin User Info */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-brand-800 text-white font-black text-xs flex items-center justify-center shrink-0">
                {(user?.name || user?.email || 'A')[0].toUpperCase()}
              </div>
              <div className="truncate flex-1">
                <div className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Administrator'}</div>
                <div className="text-[10px] text-slate-500 truncate font-mono">{user?.email}</div>
              </div>
            </div>
          </div>

          {/* Mode Pill */}
          <div className={`p-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5 ${
            isConfigured ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            {isConfigured ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Supabase Live DB</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Local Demo Database</span>
              </>
            )}
          </div>

          {/* Return to Public Store */}
          <button
            onClick={onExitAdmin}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition-colors cursor-pointer"
          >
            <Store className="w-3.5 h-3.5 text-slate-500" />
            <span>Public Storefront</span>
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>

        </div>
      </aside>

      {/* Main Admin Workspace Area */}
      <main className="flex-1 p-4 sm:p-7 max-w-7xl w-full mx-auto overflow-y-auto">
        {children}
      </main>

    </div>
  );
};
