import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const CustomDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select option...',
  label = null,
  icon: LeadingIcon = null,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  disabled = false,
  size = 'md' // 'sm' | 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Normalize options to { value, label, description, icon }
  const normalizedOptions = options.map(opt => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find(opt => opt.value === value) || null;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optValue) => {
    onChange(optValue);
    setIsOpen(false);
  };

  const isSmall = size === 'sm';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}

      {/* Dropdown Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 text-left bg-slate-50 hover:bg-slate-100/80 focus:bg-white border transition-all cursor-pointer rounded-xl font-medium ${
          isOpen ? 'border-brand-800 ring-2 ring-brand-800/15 shadow-2xs' : 'border-slate-200'
        } ${
          isSmall ? 'h-9 px-3 text-xs' : 'h-11 px-3.5 text-sm text-slate-900'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 truncate min-w-0">
          {LeadingIcon && (
            <LeadingIcon className={`shrink-0 text-slate-400 ${isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
          )}
          {selectedOption?.icon && (
            <span className="shrink-0">{selectedOption.icon}</span>
          )}
          <span className={`truncate ${selectedOption ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown className={`shrink-0 text-slate-400 transition-transform duration-200 ${
          isOpen ? 'rotate-180 text-brand-800' : ''
        } ${isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
      </button>

      {/* Floating Menu Popover */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-1.5 w-full min-w-[200px] bg-white border border-slate-200/90 rounded-2xl shadow-xl py-1.5 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 ${menuClassName}`}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-left text-xs sm:text-sm transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-brand-50/80 text-brand-900 font-extrabold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate min-w-0">
                  {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                  <div className="truncate">
                    <div className="truncate">{opt.label}</div>
                    {opt.description && (
                      <div className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                        {opt.description}
                      </div>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-brand-800 shrink-0 stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
