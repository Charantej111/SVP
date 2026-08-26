import React from 'react';
import { ArrowRight } from 'lucide-react';

export const InstamartCategories = ({ onSelectDepartment, onViewAllCategories }) => {
  const categorySections = [
    {
      title: "Dairy & Breakfast",
      items: [
        { id: "fresh-dairy", subId: "milk-dairy", name: "Milk, Curd & Lassi", imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80", bgTint: "bg-[#F0FDF4] border-[#DCFCE7]" },
        { id: "fresh-dairy", subId: "butter-cheese", name: "Butter & Paneer", imageUrl: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80", bgTint: "bg-[#FFF7ED] border-[#FFEDD5]" },
        { id: "fresh-dairy", subId: "bread-bakery", name: "Bread, Pav & Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80", bgTint: "bg-[#FEFCE8] border-[#FEF08A]" },
        { id: "fresh-dairy", subId: "eggs", name: "Farm Fresh Eggs", imageUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80", bgTint: "bg-[#FFFBEB] border-[#FEF3C7]" }
      ]
    },
    {
      title: "Grocery & Kitchen",
      items: [
        { id: "staples", subId: "atta-flour", name: "Atta, Rice and Dal", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80", bgTint: "bg-[#FEFCE8] border-[#FEF08A]" },
        { id: "food", subId: "masala-spices", name: "Masalas & Spices", imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80", bgTint: "bg-[#FFF1F2] border-[#FFE4E6]" },
        { id: "staples", subId: "cooking-oil", name: "Oils and Ghee", imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80", bgTint: "bg-[#FEF3C7] border-[#FDE68A]" },
        { id: "food", subId: "breakfast", name: "Cereals and Breakfast", imageUrl: "https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=400&q=80", bgTint: "bg-[#FAF5FF] border-[#F3E8FF]" }
      ]
    },
    {
      title: "Snacks & drinks",
      items: [
        { id: "beverages", subId: "juices", name: "Cold Drinks and Juices", imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80", bgTint: "bg-[#EFF6FF] border-[#DBEAFE]" },
        { id: "beverages", subId: "tea", name: "Tea, Coffee & Malt", imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80", bgTint: "bg-[#FDF8F6] border-[#F5E6E0]" },
        { id: "food", subId: "snacks-namkeen", name: "Chips and Namkeens", imageUrl: "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=400&q=80", bgTint: "bg-[#FEFCE8] border-[#FEF08A]" },
        { id: "food", subId: "biscuits-cookies", name: "Biscuits & Chocolates", imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80", bgTint: "bg-[#FAF5FF] border-[#E9D5FF]" }
      ]
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      
      {categorySections.map((section, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-4 border border-[#E2E2E7] shadow-2xs">
          
          {/* Section Title */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[16px] sm:text-[18px] font-extrabold text-[#02060C] tracking-tight">
              {section.title}
            </h3>
            
            <button
              onClick={onViewAllCategories}
              className="text-[11px] sm:text-[12px] font-extrabold text-[#0C831F] hover:text-[#0A6E1A] flex items-center gap-0.5 transition-colors cursor-pointer"
            >
              <span>See all</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 4-Column Category Cards Grid (Matching Screenshot 3) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
            {section.items.map((item, itemIdx) => (
              <button
                key={itemIdx}
                onClick={() => onSelectDepartment(item.id)}
                className="flex flex-col items-center text-center group cursor-pointer active:scale-95 transition-transform"
              >
                {/* Soft Tinted Card Frame */}
                <div className={`w-full aspect-[4/3] rounded-2xl ${item.bgTint} border p-2 flex items-center justify-center overflow-hidden mb-1.5 shadow-2xs group-hover:scale-[1.02] transition-transform`}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-contain filter drop-shadow-xs"
                  />
                </div>

                {/* Category Label */}
                <span className="text-[12px] sm:text-[13px] font-bold text-[#02060C] group-hover:text-[#0C831F] transition-colors leading-[15px] max-w-[120px] line-clamp-2">
                  {item.name}
                </span>
              </button>
            ))}
          </div>

        </div>
      ))}

    </section>
  );
};
