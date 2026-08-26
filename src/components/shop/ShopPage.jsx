import React, { useState, useMemo } from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { PRODUCTS } from '../../data/productsData';
import { DEPARTMENTS } from '../../data/categoriesData';
import { CustomDropdown } from '../common/CustomDropdown';

export const ShopPage = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedDepartment, 
  setSelectedDepartment,
  selectedSubcategory,
  setSelectedSubcategory
}) => {
  const [sortBy, setSortBy] = useState('popular');

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.departmentId.toLowerCase().includes(q) ||
        p.subcategoryId.toLowerCase().includes(q) ||
        p.packSize.toLowerCase().includes(q)
      );
    }

    if (selectedDepartment && selectedDepartment !== 'all') {
      result = result.filter(p => p.departmentId === selectedDepartment);
    }

    if (selectedSubcategory && selectedSubcategory !== 'all') {
      result = result.filter(p => p.subcategoryId === selectedSubcategory);
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    return result;
  }, [searchQuery, selectedDepartment, selectedSubcategory, sortBy]);

  const currentSubcategories = useMemo(() => {
    if (!selectedDepartment || selectedDepartment === 'all') return [];
    const dept = DEPARTMENTS.find(d => d.id === selectedDepartment);
    return dept ? dept.subcategories : [];
  }, [selectedDepartment]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('all');
    setSelectedSubcategory('all');
    setSortBy('popular');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-[22px] sm:text-[26px] font-extrabold text-[#02060C] tracking-tight">
          Shop Groceries
        </h1>
        <p className="text-[12px] text-[#686B78] font-medium mt-0.5">
          Browse daily staples, dairy, snacks, beverages and household essentials
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-[#E2E2E7] rounded-2xl p-3.5 sm:p-4 mb-6 shadow-xs space-y-3">
        
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search groceries by name or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-10 pr-9 bg-[#F0F0F5] focus:bg-white border border-[#E2E2E7] rounded-xl text-[13px] text-[#02060C] placeholder-[#93959F] focus:outline-none focus:ring-2 focus:ring-brand-800 transition-all font-medium"
          />
          <Search className="w-4 h-4 text-[#93959F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#93959F] hover:text-[#02060C] p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Department Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <button
            onClick={() => {
              setSelectedDepartment('all');
              setSelectedSubcategory('all');
            }}
            className={`text-[12px] font-extrabold px-3 py-1.5 rounded-lg shrink-0 transition-all border cursor-pointer ${
              selectedDepartment === 'all'
                ? 'bg-brand-800 text-white border-brand-800 shadow-2xs'
                : 'bg-[#F4F4F6] text-[#02060C] border-[#E2E2E7] hover:bg-brand-50'
            }`}
          >
            All Items
          </button>

          {DEPARTMENTS.map((dept) => (
            <button
              key={dept.id}
              onClick={() => {
                setSelectedDepartment(dept.id);
                setSelectedSubcategory('all');
              }}
              className={`text-[12px] font-extrabold px-3 py-1.5 rounded-lg shrink-0 transition-all border cursor-pointer ${
                selectedDepartment === dept.id
                  ? 'bg-brand-800 text-white border-brand-800 shadow-2xs'
                  : 'bg-[#F4F4F6] text-[#02060C] border-[#E2E2E7] hover:bg-brand-50'
              }`}
            >
              {dept.name}
            </button>
          ))}
        </div>

        {/* Subcategories */}
        {currentSubcategories.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-[#F0F0F5]">
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-md shrink-0 transition-colors cursor-pointer ${
                selectedSubcategory === 'all'
                  ? 'bg-brand-50 text-brand-800'
                  : 'text-[#686B78] hover:text-[#02060C]'
              }`}
            >
              All {DEPARTMENTS.find(d => d.id === selectedDepartment)?.shortName}
            </button>

            {currentSubcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategory(sub.id)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-md shrink-0 transition-colors cursor-pointer ${
                  selectedSubcategory === sub.id
                    ? 'bg-brand-50 text-brand-800'
                    : 'text-[#686B78] hover:text-[#02060C]'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Sort & Count Row */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F0F0F5] text-[12px]">
          <div className="text-[#686B78] font-medium">
            Showing <strong className="text-[#02060C] font-extrabold">{filteredProducts.length}</strong> products
          </div>

          <div className="flex items-center gap-1.5">
            <CustomDropdown
              size="sm"
              icon={ArrowUpDown}
              value={sortBy}
              onChange={setSortBy}
              buttonClassName="bg-[#F0F0F5] hover:bg-[#EAEAEF] border-[#E2E2E7] text-[#02060C] font-extrabold text-[11px] h-8 rounded-lg"
              menuClassName="w-48 right-0"
              options={[
                { value: 'popular', label: 'Popular First' },
                { value: 'price-asc', label: 'Price: Low to High' },
                { value: 'price-desc', label: 'Price: High to Low' }
              ]}
            />
          </div>
        </div>

      </div>

      {/* Product Results Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white border border-[#E2E2E7] rounded-2xl p-6 shadow-xs">
          <h3 className="text-[16px] font-extrabold text-[#02060C] mb-1">
            No groceries found
          </h3>
          <p className="text-[12px] text-[#686B78] max-w-sm mx-auto mb-4 leading-relaxed font-medium">
            We couldn't find any products matching your search or filter. Try searching for "oil", "atta", or "milk".
          </p>
          <button
            onClick={handleClearFilters}
            className="bg-brand-800 hover:bg-brand-900 text-white text-[12px] font-extrabold px-4 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
