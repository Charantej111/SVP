import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, Copy, Check, ExternalLink, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { STORE_CONFIG } from '../../config/storeConfig';

export const OrderSuccessModal = () => {
  const { orderSuccessData, setOrderSuccessData, clearCart, closeCheckout } = useCart();
  const [copied, setCopied] = useState(false);

  if (!orderSuccessData) return null;

  const { waUrl, orderText, totalItemsCount, subtotal, customerDetails } = orderSuccessData;

  const handleCopy = () => {
    navigator.clipboard.writeText(orderText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFinish = () => {
    clearCart();
    setOrderSuccessData(null);
    closeCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-6 border border-spv-warm-200 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-[#128C7E] text-white p-5 text-center relative">
          <button
            onClick={() => setOrderSuccessData(null)}
            className="absolute top-3 right-3 text-white/80 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold">WhatsApp Order Generated!</h2>
          <p className="text-xs text-white/90 mt-0.5">
            Send the message on WhatsApp to complete your order with {STORE_CONFIG.name}.
          </p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {/* Main Action: Open WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-center active:scale-[0.99]"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Open in WhatsApp & Press Send</span>
          </a>

          {/* Delivery Location Preview */}
          {customerDetails?.orderType === 'delivery' && (customerDetails.address || orderSuccessData.deliveryLocation?.shortAddress) && (
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-950">
              <ShoppingBag className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="font-bold">Delivery Address Attached: </span>
                <span className="text-gray-700 font-medium">
                  {customerDetails.address || orderSuccessData.deliveryLocation?.formattedAddress}
                </span>
              </div>
            </div>
          )}

          {/* Fallback Copy Text Box */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-spv-dark uppercase tracking-wider mb-1.5">
              <span>Order Message Preview:</span>
              <button
                onClick={handleCopy}
                className="text-spv-green-800 hover:text-spv-green-950 flex items-center gap-1 font-semibold normal-case text-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-spv-green-700" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Message</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-spv-warm-100/70 border border-spv-warm-200 rounded-xl p-3 text-xs font-mono text-spv-dark max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {orderText}
            </div>
          </div>

          {/* Next Steps Guide */}
          <div className="bg-spv-warm-50 border border-spv-warm-200 rounded-xl p-3 text-xs text-spv-dark space-y-1.5">
            <div className="font-bold text-spv-green-900">What happens next?</div>
            <ol className="list-decimal list-inside space-y-1 text-spv-warm-500">
              <li>Your order message will open in WhatsApp with all items pre-filled.</li>
              <li>Press the <strong>Send</strong> button in WhatsApp.</li>
              <li>Store staff will review item availability, delivery charge (if applicable), and confirm your final bill amount.</li>
            </ol>
          </div>

          {/* Finish & Clear Button */}
          <div className="pt-2">
            <button
              onClick={handleFinish}
              className="w-full bg-spv-warm-100 hover:bg-spv-warm-200 text-spv-dark font-semibold text-xs py-2.5 rounded-lg transition-colors"
            >
              Order Placed • Clear Cart & Return Home
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
