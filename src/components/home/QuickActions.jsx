import React from 'react';
import { ShoppingBag, Sparkles, LayoutGrid, MapPin, ArrowUpRight } from 'lucide-react';
import { STORE_CONFIG } from '../../config/storeConfig';

export const QuickActions = ({ onNavigate }) => {
  const actions = [
    {
      id: 'shop',
      title: 'Shop Groceries',
      subtitle: 'Browse all items',
      icon: ShoppingBag,
      iconBg: 'bg-brand-50 text-brand-700',
      action: () => onNavigate('shop')
    },
    {
      id: 'fresh',
      title: 'Fresh & Dairy',
      subtitle: 'Milk, curd & bakery',
      icon: Sparkles,
      iconBg: 'bg-emerald-50 text-emerald-700',
      action: () => onNavigate('shop')
    },
    {
      id: 'categories',
      title: 'Store Aisles',
      subtitle: '6 Departments',
      icon: LayoutGrid,
      iconBg: 'bg-blue-50 text-blue-700',
      action: () => onNavigate('categories')
    },
    {
      id: 'directions',
      title: 'Get Directions',
      subtitle: 'Visit our store',
      icon: MapPin,
      iconBg: 'bg-accent-50 text-accent-600',
      action: () => window.open(STORE_CONFIG.location.googleMapsUrl, '_blank')
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 -mt-5 sm:-mt-6 relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.action}
              className="bg-white border border-gray-200/80 rounded-2xl p-4 text-left shadow-card hover:shadow-card-hover hover:border-brand-600/40 transition-all duration-200 flex items-center justify-between group active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${action.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-brand-800 transition-colors">
                    {action.title}
                  </div>
                  <div className="text-xs text-gray-500 font-normal">
                    {action.subtitle}
                  </div>
                </div>
              </div>

              <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-brand-800 transition-colors shrink-0 hidden sm:block" />
            </button>
          );
        })}
      </div>
    </section>
  );
};
