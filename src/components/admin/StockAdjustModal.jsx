import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { CustomDropdown } from '../common/CustomDropdown';

const REASON_PRESETS = [
  'Stock arrived from supplier',
  'Physical shelf count correction',
  'Damaged / expired item removed',
  'Customer returned / cancelled item',
  'Custom note...'
];

const QUICK_INCREMENTS = [5, 10, 25, 50, 100];
const QUICK_DECREMENTS = [-1, -5, -10];

export const StockAdjustModal = ({ isOpen, onClose, product = null, currentStock = 0, onAdjust }) => {
  const [delta, setDelta] = useState(10);
  const [selectedReason, setSelectedReason] = useState(REASON_PRESETS[0]);
  const [customReason, setCustomReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDelta(10);
      setSelectedReason(REASON_PRESETS[0]);
      setCustomReason('');
      setError('');
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const current = parseInt(currentStock, 10) || 0;
  const change = parseInt(delta, 10) || 0;
  const resultingStock = current + change;
  const isInvalid = resultingStock < 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (change === 0) {
      setError('Please specify a stock adjustment quantity other than 0.');
      return;
    }

    if (resultingStock < 0) {
      setError(`Cannot reduce inventory below 0. Current stock is ${current}, change is ${change}.`);
      return;
    }

    const reason = selectedReason === 'Custom note...' 
      ? customReason.trim() 
      : selectedReason;

    if (!reason) {
      setError('Please choose or enter a reason for this stock update.');
      return;
    }

    setLoading(true);
    try {
      await onAdjust(product.id, change, reason);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update stock.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Update Stock
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Quickly adjust inventory for {product.brand} {product.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer transition-colors border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Product Header & Live Stock Flow */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-extrabold text-sm text-slate-900">
                  {product.brand} {product.name}
                </div>
                <div className="text-xs text-slate-500">
                  {product.pack_size}
                </div>
              </div>
            </div>

            {/* Visual Stock Math Display */}
            <div className="grid grid-cols-3 gap-2 items-center bg-white p-3 rounded-xl border border-slate-200 text-center">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Current</div>
                <div className="font-mono text-base sm:text-lg font-black text-slate-700">{current}</div>
              </div>

              <div className="font-mono font-bold text-xs text-slate-400">
                {change >= 0 ? `+${change}` : change}
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">New Total</div>
                <div className={`font-mono text-base sm:text-lg font-black ${
                  isInvalid ? 'text-rose-600' : 'text-brand-800'
                }`}>
                  {isInvalid ? 'Invalid (<0)' : resultingStock}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Adjustment Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Quick Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_INCREMENTS.map((qty) => (
                <button
                  key={`add-${qty}`}
                  type="button"
                  onClick={() => setDelta(qty)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                    delta === qty
                      ? 'bg-brand-800 text-white border-brand-800 shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  +{qty}
                </button>
              ))}

              <div className="h-6 w-px bg-slate-200 self-center mx-1"></div>

              {QUICK_DECREMENTS.map((qty) => (
                <button
                  key={`sub-${qty}`}
                  type="button"
                  onClick={() => setDelta(qty)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                    delta === qty
                      ? 'bg-rose-700 text-white border-rose-700 shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-rose-700 border-slate-200'
                  }`}
                >
                  {qty}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Adjustment Number Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Adjustment Quantity (+ / -)
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDelta(prev => prev - 1)}
                className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center cursor-pointer text-base"
              >
                <Minus className="w-4 h-4" />
              </button>

              <input
                type="number"
                required
                value={delta}
                onChange={(e) => setDelta(parseInt(e.target.value, 10) || 0)}
                className="flex-1 h-11 text-center bg-slate-50 border border-slate-200 focus:border-brand-800 rounded-xl text-lg font-black text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-brand-800"
              />

              <button
                type="button"
                onClick={() => setDelta(prev => prev + 1)}
                className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center cursor-pointer text-base"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <CustomDropdown
              label="Reason for Update"
              value={selectedReason}
              onChange={setSelectedReason}
              options={REASON_PRESETS}
            />

            {selectedReason === 'Custom note...' && (
              <input
                type="text"
                required
                placeholder="Type note for audit log..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 focus:border-brand-800 rounded-xl text-xs text-slate-900 mt-2 focus:outline-none"
                autoFocus
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || isInvalid || change === 0}
              className="px-6 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-900 disabled:opacity-50 text-white text-xs font-extrabold shadow-subtle flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>Update Stock</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
