export type PlatformCategory = 
  | 'food_ordering' 
  | 'quick_grocery' 
  | 'farm_dairy_meat';

export interface ShoppingPlatform {
  id: string;
  name: string;
  url: string;
  category: PlatformCategory;
  categoryLabel: string;
  deliveryTime: string;
  rating: number; // e.g. 4.8
  specialty: string;
  badge: string;
  accentColor: string;
  iconEmoji: string;
  getSearchUrl: (query: string) => string;
}

export const SHOPPING_PLATFORMS: ShoppingPlatform[] = [
  // 1. Food ordering websites
  {
    id: 'swiggy',
    name: 'Swiggy',
    url: 'https://www.swiggy.com/',
    category: 'food_ordering',
    categoryLabel: 'Food Ordering',
    deliveryTime: '25-35 mins',
    rating: 4.8,
    specialty: 'Thousands of restaurants, gourmet meals & live order tracking',
    badge: 'Popular Choice',
    accentColor: 'from-orange-500 to-amber-600',
    iconEmoji: '🛵',
    getSearchUrl: (q) => `https://www.swiggy.com/search?query=${encodeURIComponent(q)}`,
  },
  {
    id: 'zomato',
    name: 'Zomato',
    url: 'https://www.zomato.com/',
    category: 'food_ordering',
    categoryLabel: 'Food Ordering',
    deliveryTime: '30-40 mins',
    rating: 4.7,
    specialty: 'Extensive menus, verified user reviews & dining offers',
    badge: 'Top Rated',
    accentColor: 'from-rose-500 to-red-600',
    iconEmoji: '🍽️',
    getSearchUrl: (q) => `https://www.zomato.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    id: 'dominos',
    name: 'Domino’s India',
    url: 'https://www.dominos.co.in/',
    category: 'food_ordering',
    categoryLabel: 'Food Ordering',
    deliveryTime: '20-30 mins',
    rating: 4.6,
    specialty: 'Hot pizzas, garlic bread, pasta & 30-minute delivery guarantee',
    badge: 'Fast Delivery',
    accentColor: 'from-blue-600 to-indigo-700',
    iconEmoji: '🍕',
    getSearchUrl: (q) => `https://www.dominos.co.in/menu`,
  },
  {
    id: 'pizzahut',
    name: 'Pizza Hut India',
    url: 'https://www.pizzahut.co.in/',
    category: 'food_ordering',
    categoryLabel: 'Food Ordering',
    deliveryTime: '30-35 mins',
    rating: 4.5,
    specialty: 'Pan pizzas, cheesy crusts, wings & meal deals',
    badge: 'Cheesy Crusts',
    accentColor: 'from-red-600 to-rose-700',
    iconEmoji: '🍕',
    getSearchUrl: (q) => `https://www.pizzahut.co.in/`,
  },
  {
    id: 'mcdonalds',
    name: 'McDonald’s India',
    url: 'https://mcdelivery.co.in/',
    category: 'food_ordering',
    categoryLabel: 'Food Ordering',
    deliveryTime: '25-30 mins',
    rating: 4.6,
    specialty: 'Burgers, fries, McFlurry & value breakfast combos',
    badge: 'Comfort Meals',
    accentColor: 'from-amber-500 to-yellow-600',
    iconEmoji: '🍔',
    getSearchUrl: (q) => `https://mcdelivery.co.in/`,
  },
  {
    id: 'kfc',
    name: 'KFC India',
    url: 'https://online.kfc.co.in/',
    category: 'food_ordering',
    categoryLabel: 'Food Ordering',
    deliveryTime: '25-35 mins',
    rating: 4.5,
    specialty: 'Crispy fried chicken buckets, rolls & peri peri burgers',
    badge: 'Crispy Classic',
    accentColor: 'from-red-600 to-rose-800',
    iconEmoji: '🍗',
    getSearchUrl: (q) => `https://online.kfc.co.in/menu`,
  },
  {
    id: 'burgerking',
    name: 'Burger King India',
    url: 'https://www.burgerking.in/',
    category: 'food_ordering',
    categoryLabel: 'Food Ordering',
    deliveryTime: '30-35 mins',
    rating: 4.5,
    specialty: 'Flame-grilled Whoppers, crispy fries & wraps',
    badge: 'Flame Grilled',
    accentColor: 'from-orange-600 to-amber-700',
    iconEmoji: '👑',
    getSearchUrl: (q) => `https://www.burgerking.in/menu`,
  },
  {
    id: 'eatsure',
    name: 'EatSure',
    url: 'https://www.eatsure.com/',
    category: 'food_ordering',
    categoryLabel: 'Food Ordering',
    deliveryTime: '30-40 mins',
    rating: 4.7,
    specialty: 'Multi-brand food court in 1 delivery: Behrouz, Faasos, Ovenstory',
    badge: 'Multi-Brand',
    accentColor: 'from-purple-600 to-indigo-700',
    iconEmoji: '🍱',
    getSearchUrl: (q) => `https://www.eatsure.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    id: 'faasos',
    name: 'Faasos',
    url: 'https://www.faasos.com/',
    category: 'food_ordering',
    categoryLabel: 'Food Ordering',
    deliveryTime: '25-35 mins',
    rating: 4.6,
    specialty: 'Gourmet stuffed wraps, rolls & rice bowls',
    badge: 'Signature Wraps',
    accentColor: 'from-purple-500 to-pink-600',
    iconEmoji: '🌯',
    getSearchUrl: (q) => `https://www.faasos.com/`,
  },
  {
    id: 'box8',
    name: 'Box8',
    url: 'https://box8.in/',
    category: 'food_ordering',
    categoryLabel: 'Food Ordering',
    deliveryTime: '28-35 mins',
    rating: 4.6,
    specialty: 'Desi meal boxes, biryanis, parathas & desserts',
    badge: 'Desi Boxes',
    accentColor: 'from-amber-600 to-orange-700',
    iconEmoji: '📦',
    getSearchUrl: (q) => `https://box8.in/`,
  },
  {
    id: 'magicpin',
    name: 'Magicpin',
    url: 'https://magicpin.in/',
    category: 'food_ordering',
    categoryLabel: 'Food Ordering',
    deliveryTime: '30-45 mins',
    rating: 4.5,
    specialty: 'Local restaurant savings, voucher discounts & food cashback',
    badge: 'Best Discounts',
    accentColor: 'from-teal-600 to-emerald-700',
    iconEmoji: '🏷️',
    getSearchUrl: (q) => `https://magicpin.in/search?query=${encodeURIComponent(q)}`,
  },
  {
    id: 'zepto_cafe',
    name: 'Zepto Café',
    url: 'https://www.zepto.com/',
    category: 'food_ordering',
    categoryLabel: 'Food Ordering',
    deliveryTime: '10-15 mins',
    rating: 4.7,
    specialty: 'Instant hot chai, coffee, puff pastries & quick cafe snacks',
    badge: '⚡ 10-Min Café',
    accentColor: 'from-purple-600 to-pink-500',
    iconEmoji: '☕',
    getSearchUrl: (q) => `https://www.zepto.com/search?query=${encodeURIComponent(q)}`,
  },

  // 2. Grocery shopping and home delivery
  {
    id: 'bigbasket',
    name: 'BigBasket',
    url: 'https://www.bigbasket.com/',
    category: 'quick_grocery',
    categoryLabel: 'Grocery & Staples',
    deliveryTime: 'Same Day / 2 hrs',
    rating: 4.8,
    specialty: 'Full supermarket catalogue, bb daily, staples, dairy & produce',
    badge: 'Supermarket Leader',
    accentColor: 'from-emerald-600 to-teal-700',
    iconEmoji: '🛒',
    getSearchUrl: (q) => `https://www.bigbasket.com/ps/?q=${encodeURIComponent(q)}`,
  },
  {
    id: 'blinkit',
    name: 'Blinkit',
    url: 'https://blinkit.com/',
    category: 'quick_grocery',
    categoryLabel: 'Grocery & Staples',
    deliveryTime: '8-12 mins',
    rating: 4.9,
    specialty: 'Ultra-fast delivery for milk, eggs, bread, fruits, and veggies',
    badge: '⚡ 10-Min Rush',
    accentColor: 'from-yellow-500 to-amber-600',
    iconEmoji: '⚡',
    getSearchUrl: (q) => `https://blinkit.com/s/?q=${encodeURIComponent(q)}`,
  },
  {
    id: 'zepto',
    name: 'Zepto',
    url: 'https://www.zepto.com/',
    category: 'quick_grocery',
    categoryLabel: 'Grocery & Staples',
    deliveryTime: '10 mins',
    rating: 4.8,
    specialty: '10-minute grocery delivery from local dark stores',
    badge: '⚡ Instant Reorder',
    accentColor: 'from-purple-600 to-pink-600',
    iconEmoji: '🚀',
    getSearchUrl: (q) => `https://www.zepto.com/search?query=${encodeURIComponent(q)}`,
  },
  {
    id: 'swiggy_instamart',
    name: 'Swiggy Instamart',
    url: 'https://www.swiggy.com/instamart',
    category: 'quick_grocery',
    categoryLabel: 'Grocery & Staples',
    deliveryTime: '10-15 mins',
    rating: 4.8,
    specialty: 'Groceries, personal care, fresh produce & late night snacks',
    badge: '⚡ Instamart',
    accentColor: 'from-orange-500 to-red-500',
    iconEmoji: '🛍️',
    getSearchUrl: (q) => `https://www.swiggy.com/instamart/search?query=${encodeURIComponent(q)}`,
  },
  {
    id: 'jiomart',
    name: 'JioMart',
    url: 'https://www.jiomart.com/',
    category: 'quick_grocery',
    categoryLabel: 'Grocery & Staples',
    deliveryTime: 'Same Day / Next Day',
    rating: 4.6,
    specialty: 'Wholesale prices on grains, oils, packaged foods & household goods',
    badge: 'Lowest Prices',
    accentColor: 'from-blue-600 to-cyan-600',
    iconEmoji: '🏪',
    getSearchUrl: (q) => `https://www.jiomart.com/search/${encodeURIComponent(q)}`,
  },
  {
    id: 'dmart',
    name: 'DMart Ready',
    url: 'https://www.dmart.in/',
    category: 'quick_grocery',
    categoryLabel: 'Grocery & Staples',
    deliveryTime: 'Next Day Slot',
    rating: 4.8,
    specialty: 'Unmatched discount pricing on pantry staples & monthly rations',
    badge: 'Best Budget',
    accentColor: 'from-green-600 to-emerald-700',
    iconEmoji: '🏬',
    getSearchUrl: (q) => `https://www.dmart.in/search?searchTerm=${encodeURIComponent(q)}`,
  },
  {
    id: 'amazon_fresh',
    name: 'Amazon Fresh',
    url: 'https://www.amazon.in/fmc/m/30000368',
    category: 'quick_grocery',
    categoryLabel: 'Grocery & Staples',
    deliveryTime: '2-Hour Slot',
    rating: 4.7,
    specialty: 'Prime member deals, certified organic grains, fruits & cold storage',
    badge: 'Prime Delivery',
    accentColor: 'from-sky-600 to-blue-700',
    iconEmoji: '📦',
    getSearchUrl: (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}&i=nowstore`,
  },
  {
    id: 'flipkart_grocery',
    name: 'Flipkart Grocery',
    url: 'https://www.flipkart.com/grocery',
    category: 'quick_grocery',
    categoryLabel: 'Grocery & Staples',
    deliveryTime: 'Next Morning',
    rating: 4.6,
    specialty: 'Combo deals, 1 rupee deals, staples & monthly grocery boxes',
    badge: 'Mega Deals',
    accentColor: 'from-blue-500 to-yellow-500',
    iconEmoji: '🛒',
    getSearchUrl: (q) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}&marketplace=GROCERY`,
  },
  {
    id: 'natures_basket',
    name: 'Nature’s Basket',
    url: 'https://www.naturesbasket.co.in/',
    category: 'quick_grocery',
    categoryLabel: 'Grocery & Staples',
    deliveryTime: 'Same Day',
    rating: 4.7,
    specialty: 'Imported artisanal cheeses, organic produce, exotic spices & bakery',
    badge: 'Gourmet Store',
    accentColor: 'from-emerald-700 to-teal-800',
    iconEmoji: '🧀',
    getSearchUrl: (q) => `https://www.naturesbasket.co.in/online-grocery-shopping/${encodeURIComponent(q)}`,
  },
  {
    id: 'milkbasket',
    name: 'Milkbasket',
    url: 'https://www.milkbasket.com/',
    category: 'quick_grocery',
    categoryLabel: 'Grocery & Staples',
    deliveryTime: 'Morning 7 AM Doorstep',
    rating: 4.8,
    specialty: 'Daily morning doorstep delivery for milk, eggs, bread without checkout',
    badge: '7 AM Subscription',
    accentColor: 'from-blue-500 to-cyan-500',
    iconEmoji: '🥛',
    getSearchUrl: (q) => `https://www.milkbasket.com/`,
  },

  // 3. Fruits, vegetables, meat and dairy
  {
    id: 'country_delight',
    name: 'Country Delight',
    url: 'https://countrydelight.in/',
    category: 'farm_dairy_meat',
    categoryLabel: 'Farm, Dairy & Meat',
    deliveryTime: 'Morning 7 AM Daily',
    rating: 4.9,
    specialty: '100% pure cow & buffalo milk (tested for chemicals), ghee, paneer & farm eggs',
    badge: 'Pure Farm Milk',
    accentColor: 'from-amber-500 to-orange-600',
    iconEmoji: '🐄',
    getSearchUrl: (q) => `https://countrydelight.in/`,
  },
  {
    id: 'licious',
    name: 'Licious',
    url: 'https://www.licious.in/',
    category: 'farm_dairy_meat',
    categoryLabel: 'Farm, Dairy & Meat',
    deliveryTime: '30-45 mins',
    rating: 4.9,
    specialty: '100% antibiotic-residue-free chicken, tender mutton, fresh fish & kebabs',
    badge: 'Prime Meat & Fish',
    accentColor: 'from-rose-600 to-red-700',
    iconEmoji: '🥩',
    getSearchUrl: (q) => `https://www.licious.in/search?q=${encodeURIComponent(q)}`,
  },
  {
    id: 'freshtohome',
    name: 'FreshToHome',
    url: 'https://www.freshtohome.com/',
    category: 'farm_dairy_meat',
    categoryLabel: 'Farm, Dairy & Meat',
    deliveryTime: 'Same Day / 2 hrs',
    rating: 4.8,
    specialty: 'Chemical-free sea fish, antibiotic-free poultry & fresh mutton',
    badge: '0% Chemicals',
    accentColor: 'from-teal-600 to-blue-700',
    iconEmoji: '🐟',
    getSearchUrl: (q) => `https://www.freshtohome.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    id: 'meatigo',
    name: 'Meatigo',
    url: 'https://www.meatigo.com/',
    category: 'farm_dairy_meat',
    categoryLabel: 'Farm, Dairy & Meat',
    deliveryTime: 'Same Day',
    rating: 4.7,
    specialty: 'Gourmet meats, artisanal sausages, burger patties & imported seafood',
    badge: 'Gourmet Cuts',
    accentColor: 'from-red-700 to-rose-900',
    iconEmoji: '🥓',
    getSearchUrl: (q) => `https://www.meatigo.com/`,
  },
  {
    id: 'akshayakalpa',
    name: 'Akshayakalpa Organic',
    url: 'https://akshayakalpa.org/',
    category: 'farm_dairy_meat',
    categoryLabel: 'Farm, Dairy & Meat',
    deliveryTime: 'Morning Delivery',
    rating: 4.9,
    specialty: 'Certified organic dairy: A2 milk, artisanal cheese, curd, paneer & farm honey',
    badge: 'Certified Organic A2',
    accentColor: 'from-emerald-700 to-green-800',
    iconEmoji: '🌿',
    getSearchUrl: (q) => `https://akshayakalpa.org/`,
  },
  {
    id: 'organic_india',
    name: 'Organic India',
    url: 'https://organicindia.com/',
    category: 'farm_dairy_meat',
    categoryLabel: 'Farm, Dairy & Meat',
    deliveryTime: 'Standard Courier',
    rating: 4.8,
    specialty: 'Certified organic herbal teas, ghee, psyllium, pulses & holistic wellness',
    badge: 'Organic Certified',
    accentColor: 'from-green-700 to-teal-800',
    iconEmoji: '🌱',
    getSearchUrl: (q) => `https://organicindia.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    id: 'farmizen',
    name: 'Farmizen',
    url: 'https://www.farmizen.com/',
    category: 'farm_dairy_meat',
    categoryLabel: 'Farm, Dairy & Meat',
    deliveryTime: 'Harvest Day Slot',
    rating: 4.7,
    specialty: 'Chemical-free vegetables & fruits directly harvested from local organic farms',
    badge: 'Direct From Farm',
    accentColor: 'from-emerald-600 to-lime-700',
    iconEmoji: '🚜',
    getSearchUrl: (q) => `https://www.farmizen.com/`,
  },
];

/**
 * Returns platforms recommended for a specific item category
 */
export function getRecommendedPlatformsForCategory(category: string): ShoppingPlatform[] {
  const norm = category.toLowerCase();

  if (norm.includes('dairy') || norm.includes('milk') || norm.includes('egg') || norm.includes('yogurt')) {
    return SHOPPING_PLATFORMS.filter((p) =>
      ['country_delight', 'akshayakalpa', 'blinkit', 'zepto', 'bigbasket', 'milkbasket'].includes(p.id)
    );
  }

  if (norm.includes('meat') || norm.includes('seafood') || norm.includes('chicken') || norm.includes('fish')) {
    return SHOPPING_PLATFORMS.filter((p) =>
      ['licious', 'freshtohome', 'meatigo', 'zepto', 'swiggy_instamart'].includes(p.id)
    );
  }

  if (norm.includes('produce') || norm.includes('fruit') || norm.includes('vegetable') || norm.includes('greens')) {
    return SHOPPING_PLATFORMS.filter((p) =>
      ['farmizen', 'country_delight', 'bigbasket', 'blinkit', 'zepto', 'amazon_fresh'].includes(p.id)
    );
  }

  if (norm.includes('pantry') || norm.includes('grain') || norm.includes('rice') || norm.includes('flour')) {
    return SHOPPING_PLATFORMS.filter((p) =>
      ['bigbasket', 'dmart', 'jiomart', 'amazon_fresh', 'flipkart_grocery', 'organic_india'].includes(p.id)
    );
  }

  if (norm.includes('bakery') || norm.includes('snack') || norm.includes('beverage')) {
    return SHOPPING_PLATFORMS.filter((p) =>
      ['blinkit', 'zepto', 'swiggy_instamart', 'zepto_cafe', 'natures_basket'].includes(p.id)
    );
  }

  // Default: Top quick commerce & supermarkets
  return SHOPPING_PLATFORMS.filter((p) =>
    ['blinkit', 'zepto', 'swiggy_instamart', 'bigbasket', 'dmart'].includes(p.id)
  );
}
