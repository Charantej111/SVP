import React from 'react';
import { ArrowRight } from 'lucide-react';
import { DEPARTMENTS } from '../../data/categoriesData';
import { CategoryBannerImage } from '../common/CategoryBannerImage';

export const DepartmentBrowser = ({ onSelectCategory, onSelectSubcategory }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-2">
          Supermarket Aisles
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          All Store Departments
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-2 leading-relaxed">
          Browse through all 6 main departments and 25+ grocery aisles stocked at Sri Prasanna Vigneswara Superbazaar.
        </p>
      </div>

      {/* Grid of 6 Departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {DEPARTMENTS.map((dept) => (
          <div
            key={dept.id}
            className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-7 shadow-card hover:border-brand-600/40 hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Category Showcase Image */}
              <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-5 bg-gray-50/80 border border-gray-100 p-2 flex items-center justify-center">
                <CategoryBannerImage categoryId={dept.id} />
              </div>

              {/* Title & Description */}
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {dept.name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
                {dept.description}
              </p>

              {/* Subcategory Pills */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Department Aisles:
                </div>
                <div className="flex flex-wrap gap-2">
                  {dept.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => onSelectSubcategory(dept.id, sub.id)}
                      className="bg-gray-50 hover:bg-brand-800 hover:text-white text-gray-700 text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-gray-200 transition-all text-left flex items-center gap-1.5 active:scale-95 shadow-subtle"
                    >
                      <span>{sub.name}</span>
                      <ArrowRight className="w-3 h-3 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* View Full Department CTA */}
            <div className="pt-5 mt-5 border-t border-gray-100">
              <button
                onClick={() => onSelectCategory(dept.id)}
                className="w-full bg-brand-50 hover:bg-brand-800 hover:text-white text-brand-800 font-bold text-xs sm:text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-subtle"
              >
                <span>Browse all {dept.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
