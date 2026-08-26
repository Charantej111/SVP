import React, { useState, useEffect } from 'react';
import { X, Upload, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { DEPARTMENTS } from '../../data/categoriesData';
import { uploadProductImage } from '../../services/productService';
import { CustomDropdown } from '../common/CustomDropdown';

export const AdminProductModal = ({ isOpen, onClose, onSave, product = null }) => {
  const isEdit = Boolean(product);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    pack_size: '',
    price: '',
    sale_price: '',
    mrp: '',
    category_id: 'staples',
    subcategory_id: '',
    image_url: '',
    is_popular: false,
    is_monthly_essential: false,
    is_active: true,
    initial_stock: 25,
    low_stock_threshold: 5
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        pack_size: product.pack_size || '',
        price: product.price || '',
        sale_price: product.sale_price || '',
        mrp: product.mrp || product.price || '',
        category_id: product.category_id || 'staples',
        subcategory_id: product.subcategory_id || '',
        image_url: product.image_url || '',
        is_popular: Boolean(product.is_popular),
        is_monthly_essential: Boolean(product.is_monthly_essential),
        is_active: product.is_active !== false,
        initial_stock: product.stock_quantity || 25,
        low_stock_threshold: product.low_stock_threshold || 5
      });
    } else {
      setFormData({
        name: '',
        brand: '',
        pack_size: '',
        price: '',
        sale_price: '',
        mrp: '',
        category_id: 'staples',
        subcategory_id: '',
        image_url: '',
        is_popular: false,
        is_monthly_essential: false,
        is_active: true,
        initial_stock: 25,
        low_stock_threshold: 5
      });
    }
    setError('');
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const publicUrl = await uploadProductImage(file);
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (err) {
      setError('Failed to upload image: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.brand.trim() || !formData.pack_size.trim() || !formData.price) {
      setError('Please fill in all required fields (Name, Brand, Pack Size, Price).');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...formData,
        id: product?.id
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const currentCategory = DEPARTMENTS.find(d => d.id === formData.category_id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              {isEdit ? `Edit Product: ${product.name}` : 'Add New Supermarket Product'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdit ? 'Update product details, pricing, and active status' : 'Create a new catalog item with pricing and inventory'}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Product Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Superior MP Whole Wheat Atta"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 focus:border-brand-800 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-800 font-medium"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Brand Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aashirvaad / Heritage"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 focus:border-brand-800 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-800 font-medium"
              />
            </div>

            {/* Pack Size */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pack Size / Unit <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 5 kg Bag / 500 ml Pouch"
                value={formData.pack_size}
                onChange={(e) => setFormData({ ...formData, pack_size: e.target.value })}
                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 focus:border-brand-800 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-800 font-medium"
              />
            </div>

            {/* Category / Department */}
            <div>
              <CustomDropdown
                label="Department / Category *"
                value={formData.category_id}
                onChange={(val) => setFormData({ ...formData, category_id: val, subcategory_id: '' })}
                options={DEPARTMENTS.map(dept => ({
                  value: dept.id,
                  label: dept.name,
                  icon: dept.icon
                }))}
              />
            </div>

            {/* Subcategory */}
            <div>
              <CustomDropdown
                label="Subcategory / Aisle"
                value={formData.subcategory_id || ''}
                onChange={(val) => setFormData({ ...formData, subcategory_id: val })}
                placeholder="General"
                options={[
                  { value: '', label: 'General / All Items' },
                  ...(currentCategory?.subcategories || []).map(sub => ({
                    value: sub.id,
                    label: sub.name
                  }))
                ]}
              />
            </div>

            {/* Selling Price (₹) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Selling Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                required
                placeholder="265"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 focus:border-brand-800 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-800 font-medium font-mono"
              />
            </div>

            {/* MRP (₹) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Printed MRP (₹)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                placeholder="275"
                value={formData.mrp}
                onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 focus:border-brand-800 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-800 font-medium font-mono"
              />
            </div>

            {/* Image URL & Upload */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Product Image (URL or Upload)
              </label>
              
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="flex-1 h-10 px-3.5 bg-slate-50 border border-slate-200 focus:border-brand-800 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-800 font-mono"
                />

                <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                  {uploading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 text-brand-800" />
                  )}
                  <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {formData.image_url && (
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg bg-white border border-slate-200"
                  />
                  <span className="text-[11px] text-slate-500 truncate flex-1 font-mono">
                    {formData.image_url}
                  </span>
                </div>
              )}
            </div>

            {/* Initial Stock (Only for new products) */}
            {!isEdit && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Initial Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.initial_stock}
                  onChange={(e) => setFormData({ ...formData, initial_stock: e.target.value })}
                  className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 focus:border-brand-800 rounded-xl text-sm text-slate-900 focus:outline-none font-mono"
                />
              </div>
            )}

            {/* Threshold */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Low Stock Threshold
              </label>
              <input
                type="number"
                min="1"
                value={formData.low_stock_threshold}
                onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 focus:border-brand-800 rounded-xl text-sm text-slate-900 focus:outline-none font-mono"
              />
            </div>

            {/* Toggles */}
            <div className="sm:col-span-2 pt-2 flex flex-wrap gap-4 text-xs font-bold text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-800 border-slate-300 cursor-pointer"
                />
                <span>Active on Public Store</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_popular}
                  onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-800 border-slate-300 cursor-pointer"
                />
                <span>Show in Popular Shelf</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_monthly_essential}
                  onChange={(e) => setFormData({ ...formData, is_monthly_essential: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-800 border-slate-300 cursor-pointer"
                />
                <span>Monthly Essential Checklist</span>
              </label>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-900 disabled:opacity-50 text-white text-xs font-extrabold shadow-subtle flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              {saving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>{isEdit ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
