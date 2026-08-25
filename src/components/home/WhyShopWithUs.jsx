import React from 'react';
import { Package, ShoppingBag, MapPin, MessageCircle } from 'lucide-react';
import { STORE_CONFIG } from '../../config/storeConfig';

export const WhyShopWithUs = () => {
  const reasons = [
    {
      title: 'Everyday essentials',
      description: 'Rice, dals, oils, spices, snacks, and household cleaning products for everyday life.',
      icon: Package,
      iconColor: 'bg-emerald-50 text-emerald-700'
    },
    {
      title: 'Convenient shopping',
      description: 'Quickly find what you need from your phone without having to search through every physical aisle.',
      icon: ShoppingBag,
      iconColor: 'bg-amber-50 text-amber-700'
    },
    {
      title: 'Local & familiar',
      description: 'A genuine supermarket serving customers in Kutukuluru, Ramavaram and nearby villages.',
      icon: MapPin,
      iconColor: 'bg-blue-50 text-blue-700'
    },
    {
      title: 'Easy WhatsApp ordering',
      description: 'Build your grocery cart, provide your address, and send your complete order directly through WhatsApp.',
      icon: MessageCircle,
      iconColor: 'bg-green-50 text-green-700'
    }
  ];

  return (
    <section className="bg-gray-50/70 border-y border-gray-200/60 py-14 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-1.5">
            Local & Trusted
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Your neighbourhood supermarket
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
            Combining the trust of your local store with the ease of modern mobile ordering.
          </p>
        </div>

        {/* 4 Feature Cards with NRI Connects styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-7 shadow-card hover:shadow-card-hover hover:border-brand-600/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${reason.iconColor} flex items-center justify-center mb-5 shadow-subtle`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {reason.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                    {reason.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
