import React from 'react';
import { ArrowRight } from 'lucide-react';
import { DEPARTMENTS } from '../../data/categoriesData';
import { CategoryBannerImage } from '../common/CategoryBannerImage';

export const CategoryScroll = ({ onSelectDepartment, onViewAllCategories }) => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12 md:py-14">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Shop by Department
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Explore 6 supermarket aisles with 100% genuine brands
          </p>
        </div>

        <button
          onClick={onViewAllCategories}
          className="text-xs sm:text-sm font-bold text-brand-800 hover:text-brand-900 flex items-center gap-1 transition-colors"
        >
          <span>See all</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* SPAR-Style Clean Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept.id}
            onClick={() => onSelectDepartment(dept.id)}
            className="bg-white border border-gray-200/80 rounded-2xl p-4 text-center flex flex-col items-center justify-between hover:border-brand-600/50 hover:shadow-card-hover transition-all duration-200 group active:scale-95 shadow-subtle"
          >
            {/* Visual Product Composition with Pastel Canvas */}
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-gray-50/90 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-200 border border-gray-100">
              <CategoryBannerImage categoryId={dept.id} />
            </div>

            {/* Title & Count */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-brand-800 transition-colors leading-tight">
                {dept.name}
              </h3>
              <span className="text-[11px] text-gray-500 font-medium mt-1 block">
                {dept.subcategories.length} aisles
              </span>
            </div>
          </button>
        ))}
      </div>

    </section>
  );
};
