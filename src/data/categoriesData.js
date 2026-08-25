/**
 * Supermarket Categories and Departments Data for Sri Prasanna Vigneswara Superbazaar
 * 
 * High-quality department photography from CDN sources (No emojis).
 */

export const DEPARTMENTS = [
  {
    id: "staples",
    name: "Staples & Kitchen Needs",
    shortName: "Staples",
    tagline: "Rice, Atta, Dals, Cooking Oils, Ghee & Spices",
    description: "Everyday household cooking ingredients from top trusted millers and brands.",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    color: {
      bg: "bg-amber-50/70",
      text: "text-amber-800",
      border: "border-amber-200"
    },
    subcategories: [
      { id: "atta-flour", name: "Atta, Flours & Sooji" },
      { id: "rice-grains", name: "Rice & Grains" },
      { id: "dals-pulses", name: "Dals & Pulses" },
      { id: "cooking-oil", name: "Edible & Cooking Oils" },
      { id: "ghee-vanaspati", name: "Ghee & Vanaspati" },
      { id: "sugar-jaggery-salt", name: "Salt, Sugar & Jaggery" }
    ]
  },
  {
    id: "food",
    name: "Snacks & Packaged Food",
    shortName: "Snacks & Food",
    tagline: "Biscuits, Noodles, Namkeen, Spices & Breakfast",
    description: "Ready-to-cook items, evening snacks, tea-time biscuits and spices.",
    imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80",
    color: {
      bg: "bg-orange-50/70",
      text: "text-orange-800",
      border: "border-orange-200"
    },
    subcategories: [
      { id: "biscuits-cookies", name: "Biscuits & Cookies" },
      { id: "noodles-pasta", name: "Noodles, Pasta & Vermicelli" },
      { id: "snacks-namkeen", name: "Namkeen & Chips" },
      { id: "masala-spices", name: "Masalas & Ground Spices" },
      { id: "breakfast", name: "Breakfast Cereals & Oats" },
      { id: "chocolates-sweets", name: "Chocolates & Sweets" }
    ]
  },
  {
    id: "fresh-dairy",
    name: "Fresh Produce & Dairy",
    shortName: "Fresh & Dairy",
    tagline: "Fresh Milk, Curd, Butter, Paneer, Bread & Farm Eggs",
    description: "Daily replenished milk, dairy essentials, fresh bread and seasonal produce.",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
    color: {
      bg: "bg-emerald-50/70",
      text: "text-emerald-800",
      border: "border-emerald-200"
    },
    subcategories: [
      { id: "milk-dairy", name: "Milk, Curd & Paneer" },
      { id: "bread-bakery", name: "Bread, Pav & Buns" },
      { id: "eggs", name: "Farm Fresh Eggs" },
      { id: "fruits-vegetables", name: "Fresh Vegetables & Mandi" }
    ]
  },
  {
    id: "beverages",
    name: "Beverages & Tea/Coffee",
    shortName: "Beverages",
    tagline: "Tea Powders, Filter Coffee, Health Drinks & Juices",
    description: "Refreshing daily tea, premium coffee blends, nutrition drinks and juices.",
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    color: {
      bg: "bg-amber-50/70",
      text: "text-amber-900",
      border: "border-amber-200"
    },
    subcategories: [
      { id: "tea", name: "Tea & Chai Powders" },
      { id: "coffee", name: "Coffee & Instant Mixes" },
      { id: "health-drinks", name: "Health & Malt Drinks" },
      { id: "juices", name: "Fruit Juices & Squashes" },
      { id: "packaged-water", name: "Packaged Water" },
      { id: "soft-drinks", name: "Soft Drinks & Soda" }
    ]
  },
  {
    id: "personal-care",
    name: "Personal Care & Hygiene",
    shortName: "Personal Care",
    tagline: "Soaps, Oral Care, Hair Oils, Shampoos & Skin Care",
    description: "Daily personal hygiene, family grooming and baby care essentials.",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    color: {
      bg: "bg-purple-50/70",
      text: "text-purple-800",
      border: "border-purple-200"
    },
    subcategories: [
      { id: "bath-body", name: "Bath Soaps & Body Wash" },
      { id: "oral-care", name: "Toothpaste & Brushes" },
      { id: "hair-care", name: "Hair Oils & Shampoos" },
      { id: "skin-care", name: "Creams, Lotions & Talc" },
      { id: "feminine-care", name: "Feminine Hygiene" },
      { id: "baby-care", name: "Baby Diapers & Care" }
    ]
  },
  {
    id: "home-cleaning",
    name: "Home Care & Cleaning",
    shortName: "Home Cleaning",
    tagline: "Detergents, Dishwash, Floor Cleaners & Household",
    description: "Keep your home spotless with leading detergents and cleaning liquids.",
    imageUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80",
    color: {
      bg: "bg-blue-50/70",
      text: "text-blue-800",
      border: "border-blue-200"
    },
    subcategories: [
      { id: "laundry", name: "Detergent Powders & Bars" },
      { id: "dishwashing", name: "Dishwash Bars & Liquids" },
      { id: "floor-cleaning", name: "Floor & Surface Cleaners" },
      { id: "toilet-cleaning", name: "Toilet Cleaners & Blocks" },
      { id: "household-utilities", name: "Mosquito Repellents & Matchboxes" },
      { id: "kitchen-essentials", name: "Foils, Wraps & Garbage Bags" }
    ]
  }
];
