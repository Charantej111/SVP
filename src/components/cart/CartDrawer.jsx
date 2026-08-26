import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import { STORE_CONFIG } from '../../config/storeConfig';
import { ProductImage } from '../common/ProductImage';

export const CartDrawer = () => {
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    totalItemsCount, 
    subtotal,
    openCheckout
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 w-full sm:max-w-md flex pl-0">
        <div className="w-full bg-white flex flex-col shadow-2xl h-full overflow-hidden">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-800 text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Your Grocery Cart
                </h2>
                <p className="text-xs text-gray-500">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} ready for WhatsApp
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 divide-y divide-gray-100">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-800 border border-gray-100">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-xs mx-auto mb-6">
                  Add groceries, staples, dairy and household essentials to build your WhatsApp order.
                </p>
                <button
                  onClick={closeCart}
                  className="bg-brand-800 hover:bg-brand-900 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition-colors shadow-subtle"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex items-center justify-between gap-3">
                  
                  {/* Thumbnail Image */}
                  <div className="w-14 h-14 rounded-xl bg-gray-50 p-1 border border-gray-100 shrink-0 overflow-hidden flex items-center justify-center">
                    <ProductImage
                      imageUrl={item.imageUrl}
                      brand={item.brand}
                      name={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase font-bold text-gray-400">
                      {item.brand}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.packSize} • <span className="font-bold text-gray-900">{formatPrice(item.price)}</span>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl flex items-center p-0.5 shadow-xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-700 hover:bg-white rounded-lg transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-gray-900 px-2 min-w-[22px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-700 hover:bg-white rounded-lg transition-colors"
                        aria-label="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Footer Area */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/90 shrink-0 space-y-3.5 pb-6 sm:pb-6">
              
              {/* Subtotal breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Total Items:</span>
                  <span className="font-bold text-gray-900">{totalItemsCount} units</span>
                </div>
                <div className="flex justify-between items-center text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Estimated Subtotal:</span>
                  <span className="text-brand-800 font-extrabold text-lg sm:text-xl">{formatPrice(subtotal)}</span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-2 text-xs text-gray-500 leading-tight">
                <ShieldCheck className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                <span>{STORE_CONFIG.policies.deliveryDisclaimer}</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 space-y-2">
                <button
                  onClick={openCheckout}
                  className="w-full bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-subtle flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
                >
                  <span>Continue to Customer Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={clearCart}
                  className="w-full text-center text-xs font-semibold text-gray-400 hover:text-red-600 transition-colors py-1 cursor-pointer"
                >
                  Clear all items
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
