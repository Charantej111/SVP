import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import { ProductImage } from '../common/ProductImage';

export const ProductCard = ({ product }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  return (
    <div className="bg-white rounded-2xl border border-[#E2E2E7] p-2.5 sm:p-3 flex flex-col justify-between hover:border-brand-800/40 hover:shadow-card-hover transition-all duration-200 group relative">
      
      {/* Product Image Frame with Bold Round Corners */}
      <div className="w-full aspect-square rounded-2xl bg-white p-1 relative overflow-hidden flex items-center justify-center mb-2 border border-black/[0.06] shadow-2xs">
        <ProductImage
          imageUrl={product.imageUrl}
          brand={product.brand}
          name={product.name}
          className="w-full h-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Brand */}
          <div className="text-[10px] font-bold text-[#93959F] uppercase tracking-wider line-clamp-1">
            {product.brand}
          </div>

          {/* Product Name */}
          <h3 className="text-[13px] sm:text-[14px] font-bold text-[#02060C] line-clamp-2 leading-[18px] mt-0.5 font-sans">
            {product.name}
          </h3>

          {/* Pack Size */}
          <div className="text-[11px] sm:text-[12px] text-[#686B78] font-medium mt-0.5">
            {product.packSize}
          </div>
        </div>

        {/* Instamart Price & ADD Button Row */}
        <div className="mt-2.5 pt-2 border-t border-[#F0F0F5] flex items-center justify-between gap-1.5">
          
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-[14px] sm:text-[15px] font-extrabold text-[#02060C] tracking-tight leading-none">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Instamart Signature ADD Button */}
          <div className="w-[72px] sm:w-[78px] shrink-0">
            {quantity === 0 ? (
              <button
                onClick={() => addToCart(product, 1)}
                className="w-full h-[32px] bg-white hover:bg-brand-50 text-brand-800 border border-brand-800 font-extrabold text-[11px] sm:text-[12px] rounded-lg transition-all flex items-center justify-center gap-0.5 active:scale-95 shadow-2xs uppercase tracking-tight cursor-pointer font-sans"
              >
                <span>ADD</span>
                <Plus className="w-3.5 h-3.5 stroke-[3px]" />
              </button>
            ) : (
              <div className="w-full h-[32px] bg-brand-800 text-white rounded-lg flex items-center justify-between px-1 shadow-xs font-sans">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-brand-900 active:scale-90 transition-transform cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.5px]" />
                </button>
                
                <span className="font-extrabold text-[12px] px-0.5 text-center min-w-[16px]">
                  {quantity}
                </span>

                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-brand-900 active:scale-90 transition-transform cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5px]" />
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
