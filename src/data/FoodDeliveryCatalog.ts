export interface FoodItem {
  id: string
  name: string
  type: 'cooked' | 'raw_ingredient'
  category: 'main_dish' | 'side_dish' | 'appetizer' | 'dessert' | 'beverage' | 'protein' | 'vegetable' | 'grain' | 'dairy' | 'spice' | 'sauce'
  description: string
  price: number
  image?: string
  preparationTime: number // in minutes
  servingSize: string
  nutritionInfo: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
    sodium: number
    allergens: string[]
  }
  dietaryTags: string[] // 'vegan', 'vegetarian', 'gluten-free', 'keto', 'paleo', 'low-carb', 'high-protein'
  ingredients: string[]
  cookingInstructions?: string
  storageInstructions: string
  shelfLife: number // in days
  difficulty: 'easy' | 'medium' | 'hard'
  cuisine: string
  spiceLevel: 0 | 1 | 2 | 3 | 4 | 5
  isPopular: boolean
  isSeasonal: boolean
  availability: 'always' | 'weekdays' | 'weekends' | 'seasonal'
}

export interface PickupPoint {
  id: string
  name: string
  address: string
  city: string
  zipCode: string
  coordinates: {
    lat: number
    lng: number
  }
  operatingHours: {
    monday: { open: string, close: string }
    tuesday: { open: string, close: string }
    wednesday: { open: string, close: string }
    thursday: { open: string, close: string }
    friday: { open: string, close: string }
    saturday: { open: string, close: string }
    sunday: { open: string, close: string }
  }
  contactInfo: {
    phone: string
    email: string
  }
  services: string[] // 'hot_meals', 'cold_meals', 'raw_ingredients', 'meal_prep', 'catering'
  capacity: number
  isActive: boolean
  specialInstructions?: string
}

export interface DeliveryZone {
  id: string
  name: string
  zipCodes: string[]
  deliveryFee: number
  minOrderAmount: number
  estimatedDeliveryTime: string
  isActive: boolean
}

export const foodItems: FoodItem[] = [
  // Cooked Meals - Main Dishes
  {
    id: 'grilled-salmon-teriyaki',
    name: 'Grilled Salmon Teriyaki',
    type: 'cooked',
    category: 'main_dish',
    description: 'Fresh Atlantic salmon grilled to perfection with homemade teriyaki glaze, served with jasmine rice and steamed broccoli',
    price: 18.99,
    image: '/images/grilled-salmon-teriyaki.jpg',
    preparationTime: 25,
    servingSize: '1 serving',
    nutritionInfo: {
      calories: 420,
      protein: 35,
      carbs: 28,
      fat: 18,
      fiber: 3,
      sodium: 680,
      allergens: ['fish', 'soy', 'sesame']
    },
    dietaryTags: ['gluten-free', 'high-protein', 'keto-friendly'],
    ingredients: ['Atlantic salmon fillet', 'teriyaki sauce', 'jasmine rice', 'broccoli', 'sesame seeds', 'green onions'],
    cookingInstructions: 'Grill salmon for 6-7 minutes per side, brush with teriyaki glaze, serve over rice with steamed broccoli',
    storageInstructions: 'Refrigerate immediately, consume within 2 days',
    shelfLife: 2,
    difficulty: 'medium',
    cuisine: 'Japanese',
    spiceLevel: 2,
    isPopular: true,
    isSeasonal: false,
    availability: 'always'
  },
  {
    id: 'chicken-tikka-masala',
    name: 'Chicken Tikka Masala',
    type: 'cooked',
    category: 'main_dish',
    description: 'Tender chicken pieces in rich, creamy tomato-based curry sauce with aromatic spices, served with basmati rice and naan bread',
    price: 16.99,
    image: '/images/chicken-tikka-masala.jpg',
    preparationTime: 30,
    servingSize: '1 serving',
    nutritionInfo: {
      calories: 580,
      protein: 42,
      carbs: 45,
      fat: 22,
      fiber: 4,
      sodium: 920,
      allergens: ['dairy', 'gluten', 'nuts']
    },
    dietaryTags: ['high-protein'],
    ingredients: ['chicken breast', 'tomato sauce', 'heavy cream', 'yogurt', 'garam masala', 'ginger', 'garlic', 'basmati rice', 'naan bread'],
    cookingInstructions: 'Marinate chicken in yogurt and spices, grill, then simmer in tomato-cream sauce',
    storageInstructions: 'Refrigerate immediately, consume within 3 days',
    shelfLife: 3,
    difficulty: 'hard',
    cuisine: 'Indian',
    spiceLevel: 3,
    isPopular: true,
    isSeasonal: false,
    availability: 'always'
  },
  {
    id: 'quinoa-buddha-bowl',
    name: 'Quinoa Buddha Bowl',
    type: 'cooked',
    category: 'main_dish',
    description: 'Nutrient-packed bowl with quinoa, roasted vegetables, chickpeas, avocado, and tahini dressing',
    price: 14.99,
    image: '/images/quinoa-buddha-bowl.jpg',
    preparationTime: 20,
    servingSize: '1 serving',
    nutritionInfo: {
      calories: 480,
      protein: 18,
      carbs: 65,
      fat: 16,
      fiber: 12,
      sodium: 420,
      allergens: ['sesame']
    },
    dietaryTags: ['vegan', 'vegetarian', 'gluten-free', 'high-fiber'],
    ingredients: ['quinoa', 'sweet potato', 'chickpeas', 'avocado', 'kale', 'tahini', 'lemon', 'olive oil'],
    cookingInstructions: 'Cook quinoa, roast vegetables, assemble bowl with fresh ingredients and tahini dressing',
    storageInstructions: 'Refrigerate immediately, consume within 2 days',
    shelfLife: 2,
    difficulty: 'easy',
    cuisine: 'Mediterranean',
    spiceLevel: 1,
    isPopular: true,
    isSeasonal: false,
    availability: 'always'
  },

  // Raw Ingredients - Proteins
  {
    id: 'organic-chicken-breast',
    name: 'Organic Chicken Breast',
    type: 'raw_ingredient',
    category: 'protein',
    description: 'Free-range, antibiotic-free chicken breast, perfect for grilling, baking, or pan-searing',
    price: 12.99,
    image: '/images/organic-chicken-breast.jpg',
    preparationTime: 0,
    servingSize: '1 lb',
    nutritionInfo: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sodium: 74,
      allergens: []
    },
    dietaryTags: ['gluten-free', 'keto', 'paleo', 'high-protein'],
    ingredients: ['organic chicken breast'],
    storageInstructions: 'Refrigerate at 40°F or below, use within 2 days of purchase',
    shelfLife: 2,
    difficulty: 'easy',
    cuisine: 'Universal',
    spiceLevel: 0,
    isPopular: true,
    isSeasonal: false,
    availability: 'always'
  },
  {
    id: 'wild-caught-salmon-fillet',
    name: 'Wild-Caught Salmon Fillet',
    type: 'raw_ingredient',
    category: 'protein',
    description: 'Fresh wild-caught salmon fillet, sustainably sourced from Alaskan waters',
    price: 22.99,
    image: '/images/wild-salmon-fillet.jpg',
    preparationTime: 0,
    servingSize: '1 lb',
    nutritionInfo: {
      calories: 208,
      protein: 25,
      carbs: 0,
      fat: 12,
      fiber: 0,
      sodium: 59,
      allergens: ['fish']
    },
    dietaryTags: ['gluten-free', 'keto', 'paleo', 'high-protein', 'omega-3'],
    ingredients: ['wild-caught salmon fillet'],
    storageInstructions: 'Refrigerate at 32°F, use within 1 day for best quality',
    shelfLife: 1,
    difficulty: 'easy',
    cuisine: 'Universal',
    spiceLevel: 0,
    isPopular: true,
    isSeasonal: false,
    availability: 'always'
  },

  // Raw Ingredients - Vegetables
  {
    id: 'organic-mixed-greens',
    name: 'Organic Mixed Greens',
    type: 'raw_ingredient',
    category: 'vegetable',
    description: 'Fresh organic mix of baby spinach, arugula, kale, and romaine lettuce',
    price: 6.99,
    image: '/images/organic-mixed-greens.jpg',
    preparationTime: 0,
    servingSize: '5 oz bag',
    nutritionInfo: {
      calories: 20,
      protein: 2,
      carbs: 4,
      fat: 0.3,
      fiber: 2,
      sodium: 10,
      allergens: []
    },
    dietaryTags: ['vegan', 'vegetarian', 'gluten-free', 'keto', 'paleo', 'low-calorie'],
    ingredients: ['organic baby spinach', 'organic arugula', 'organic kale', 'organic romaine lettuce'],
    storageInstructions: 'Refrigerate immediately, keep dry, consume within 5 days',
    shelfLife: 5,
    difficulty: 'easy',
    cuisine: 'Universal',
    spiceLevel: 0,
    isPopular: true,
    isSeasonal: false,
    availability: 'always'
  },
  {
    id: 'sweet-potatoes',
    name: 'Organic Sweet Potatoes',
    type: 'raw_ingredient',
    category: 'vegetable',
    description: 'Fresh organic sweet potatoes, perfect for roasting, mashing, or making fries',
    price: 4.99,
    image: '/images/sweet-potatoes.jpg',
    preparationTime: 0,
    servingSize: '2 lbs',
    nutritionInfo: {
      calories: 86,
      protein: 2,
      carbs: 20,
      fat: 0.1,
      fiber: 3,
      sodium: 4,
      allergens: []
    },
    dietaryTags: ['vegan', 'vegetarian', 'gluten-free', 'paleo', 'high-fiber'],
    ingredients: ['organic sweet potatoes'],
    storageInstructions: 'Store in cool, dry place, use within 2 weeks',
    shelfLife: 14,
    difficulty: 'easy',
    cuisine: 'Universal',
    spiceLevel: 0,
    isPopular: true,
    isSeasonal: false,
    availability: 'always'
  },

  // Raw Ingredients - Grains
  {
    id: 'quinoa-grain',
    name: 'Organic Quinoa',
    type: 'raw_ingredient',
    category: 'grain',
    description: 'Premium organic quinoa, a complete protein grain perfect for salads, bowls, and side dishes',
    price: 8.99,
    image: '/images/quinoa-grain.jpg',
    preparationTime: 0,
    servingSize: '1 lb bag',
    nutritionInfo: {
      calories: 222,
      protein: 8,
      carbs: 39,
      fat: 3.6,
      fiber: 5,
      sodium: 7,
      allergens: []
    },
    dietaryTags: ['vegan', 'vegetarian', 'gluten-free', 'high-protein', 'high-fiber'],
    ingredients: ['organic quinoa'],
    storageInstructions: 'Store in cool, dry place, use within 2 years',
    shelfLife: 730,
    difficulty: 'easy',
    cuisine: 'Universal',
    spiceLevel: 0,
    isPopular: true,
    isSeasonal: false,
    availability: 'always'
  },

  // Cooked Meals - Side Dishes
  {
    id: 'roasted-vegetables',
    name: 'Roasted Seasonal Vegetables',
    type: 'cooked',
    category: 'side_dish',
    description: 'Seasonal vegetables roasted with herbs and olive oil - carrots, Brussels sprouts, and butternut squash',
    price: 7.99,
    image: '/images/roasted-vegetables.jpg',
    preparationTime: 15,
    servingSize: '1 serving',
    nutritionInfo: {
      calories: 120,
      protein: 3,
      carbs: 18,
      fat: 4,
      fiber: 6,
      sodium: 180,
      allergens: []
    },
    dietaryTags: ['vegan', 'vegetarian', 'gluten-free', 'paleo', 'high-fiber'],
    ingredients: ['carrots', 'Brussels sprouts', 'butternut squash', 'olive oil', 'thyme', 'rosemary', 'salt', 'pepper'],
    cookingInstructions: 'Toss vegetables with oil and herbs, roast at 425°F for 25-30 minutes',
    storageInstructions: 'Refrigerate immediately, consume within 3 days',
    shelfLife: 3,
    difficulty: 'easy',
    cuisine: 'Mediterranean',
    spiceLevel: 1,
    isPopular: true,
    isSeasonal: true,
    availability: 'seasonal'
  },

  // Cooked Meals - Desserts
  {
    id: 'chocolate-avocado-mousse',
    name: 'Chocolate Avocado Mousse',
    type: 'cooked',
    category: 'dessert',
    description: 'Rich, creamy chocolate mousse made with avocado, cocoa powder, and maple syrup - guilt-free indulgence',
    price: 9.99,
    image: '/images/chocolate-avocado-mousse.jpg',
    preparationTime: 10,
    servingSize: '1 serving',
    nutritionInfo: {
      calories: 180,
      protein: 4,
      carbs: 22,
      fat: 12,
      fiber: 8,
      sodium: 15,
      allergens: []
    },
    dietaryTags: ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'refined-sugar-free'],
    ingredients: ['avocado', 'cocoa powder', 'maple syrup', 'vanilla extract', 'almond milk', 'sea salt'],
    cookingInstructions: 'Blend all ingredients until smooth and creamy, chill for 2 hours',
    storageInstructions: 'Refrigerate immediately, consume within 3 days',
    shelfLife: 3,
    difficulty: 'easy',
    cuisine: 'Universal',
    spiceLevel: 0,
    isPopular: true,
    isSeasonal: false,
    availability: 'always'
  }
]

export const pickupPoints: PickupPoint[] = [
  {
    id: 'downtown-kitchen',
    name: 'Downtown Kitchen Hub',
    address: '123 Main Street',
    city: 'Downtown',
    zipCode: '10001',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    operatingHours: {
      monday: { open: '06:00', close: '22:00' },
      tuesday: { open: '06:00', close: '22:00' },
      wednesday: { open: '06:00', close: '22:00' },
      thursday: { open: '06:00', close: '22:00' },
      friday: { open: '06:00', close: '23:00' },
      saturday: { open: '07:00', close: '23:00' },
      sunday: { open: '08:00', close: '21:00' }
    },
    contactInfo: {
      phone: '(555) 123-4567',
      email: 'downtown@fooddelivery.com'
    },
    services: ['hot_meals', 'cold_meals', 'raw_ingredients', 'meal_prep', 'catering'],
    capacity: 200,
    isActive: true,
    specialInstructions: 'Parking available in rear lot. Ring doorbell for pickup.'
  },
  {
    id: 'westside-fresh',
    name: 'Westside Fresh Market',
    address: '456 Oak Avenue',
    city: 'Westside',
    zipCode: '10002',
    coordinates: { lat: 40.7505, lng: -73.9934 },
    operatingHours: {
      monday: { open: '07:00', close: '21:00' },
      tuesday: { open: '07:00', close: '21:00' },
      wednesday: { open: '07:00', close: '21:00' },
      thursday: { open: '07:00', close: '21:00' },
      friday: { open: '07:00', close: '22:00' },
      saturday: { open: '08:00', close: '22:00' },
      sunday: { open: '09:00', close: '20:00' }
    },
    contactInfo: {
      phone: '(555) 234-5678',
      email: 'westside@fooddelivery.com'
    },
    services: ['raw_ingredients', 'meal_prep'],
    capacity: 150,
    isActive: true,
    specialInstructions: 'Enter through main entrance. Pickup counter on the right.'
  },
  {
    id: 'eastside-bistro',
    name: 'Eastside Bistro & Kitchen',
    address: '789 Pine Street',
    city: 'Eastside',
    zipCode: '10003',
    coordinates: { lat: 40.7614, lng: -73.9776 },
    operatingHours: {
      monday: { open: '11:00', close: '23:00' },
      tuesday: { open: '11:00', close: '23:00' },
      wednesday: { open: '11:00', close: '23:00' },
      thursday: { open: '11:00', close: '23:00' },
      friday: { open: '11:00', close: '24:00' },
      saturday: { open: '10:00', close: '24:00' },
      sunday: { open: '10:00', close: '22:00' }
    },
    contactInfo: {
      phone: '(555) 345-6789',
      email: 'eastside@fooddelivery.com'
    },
    services: ['hot_meals', 'cold_meals', 'catering'],
    capacity: 100,
    isActive: true,
    specialInstructions: 'Call upon arrival. Curbside pickup available.'
  }
]

export const deliveryZones: DeliveryZone[] = [
  {
    id: 'downtown-zone',
    name: 'Downtown Zone',
    zipCodes: ['10001', '10002', '10003', '10004', '10005'],
    deliveryFee: 2.99,
    minOrderAmount: 25.00,
    estimatedDeliveryTime: '30-45 minutes',
    isActive: true
  },
  {
    id: 'midtown-zone',
    name: 'Midtown Zone',
    zipCodes: ['10010', '10011', '10012', '10013', '10014'],
    deliveryFee: 3.99,
    minOrderAmount: 30.00,
    estimatedDeliveryTime: '35-50 minutes',
    isActive: true
  },
  {
    id: 'uptown-zone',
    name: 'Uptown Zone',
    zipCodes: ['10020', '10021', '10022', '10023', '10024'],
    deliveryFee: 4.99,
    minOrderAmount: 35.00,
    estimatedDeliveryTime: '40-55 minutes',
    isActive: true
  }
]

export const dietaryPreferences = [
  'vegan',
  'vegetarian',
  'gluten-free',
  'keto',
  'paleo',
  'low-carb',
  'high-protein',
  'dairy-free',
  'nut-free',
  'soy-free',
  'low-sodium',
  'high-fiber',
  'mediterranean',
  'pescatarian',
  'flexitarian'
]

export const cuisineTypes = [
  'American',
  'Italian',
  'Mexican',
  'Asian',
  'Indian',
  'Mediterranean',
  'Middle Eastern',
  'Thai',
  'Chinese',
  'Japanese',
  'Korean',
  'French',
  'Spanish',
  'Greek',
  'Fusion'
]

export const mealTypes = [
  'breakfast',
  'lunch',
  'dinner',
  'snack',
  'dessert',
  'appetizer',
  'side_dish',
  'main_dish',
  'beverage'
]

export const spiceLevels = [
  { level: 0, name: 'Mild', description: 'No spice, very mild flavors' },
  { level: 1, name: 'Light', description: 'Subtle spice, gentle heat' },
  { level: 2, name: 'Medium', description: 'Moderate spice, noticeable heat' },
  { level: 3, name: 'Hot', description: 'Strong spice, significant heat' },
  { level: 4, name: 'Very Hot', description: 'Intense spice, very hot' },
  { level: 5, name: 'Extreme', description: 'Maximum spice, extremely hot' }
]
