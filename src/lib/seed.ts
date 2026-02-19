import {
  Firestore,
  addDoc,
  collection,
  doc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import type { Category, Tag, Business, IngestionSource } from './types';

// Omit 'id' as Firestore will generate it.
const SEED_CATEGORIES: Omit<Category, 'id'>[] = [
  {
    name_en: 'Restaurants & Cafes',
    name_ar: 'مطاعم ومقاهي',
    icon_name: 'UtensilsCrossed',
  },
  {
    name_en: 'Shopping',
    name_ar: 'التسوق',
    icon_name: 'ShoppingCart',
  },
  {
    name_en: 'Health & Medical',
    name_ar: 'الصحة والطب',
    icon_name: 'HeartPulse',
  },
  {
    name_en: 'Government',
    name_ar: 'خدمات حكومية',
    icon_name: 'Landmark',
  },
  {
    name_en: 'Automotive',
    name_ar: 'السيارات',
    icon_name: 'Car',
  },
  {
    name_en: 'Hotels & Stays',
    name_ar: 'فنادق وإقامات',
    icon_name: 'Hotel',
  },
  {
    name_en: 'Beauty & Spas',
    name_ar: 'تجميل وسبا',
    icon_name: 'Sparkles',
  },
  {
    name_en: 'Fashion & Apparel',
    name_ar: 'أزياء وملابس',
    icon_name: 'Shirt',
  },
  {
    name_en: 'Real Estate',
    name_ar: 'العقارات',
    icon_name: 'Building',
  },
  {
    name_en: 'Professional Services',
    name_ar: 'خدمات احترافية',
    icon_name: 'Briefcase',
  },
  { name_en: 'Education', name_ar: 'التعليم', icon_name: 'Book' },
  { name_en: 'Travel & Tourism', name_ar: 'السفر والسياحة', icon_name: 'Plane' },
];

const SEED_TAGS: Omit<Tag, 'id'>[] = [
  { name_en: 'Delivery Available', name_ar: 'التوصيل متاح' },
  { name_en: 'Parking', name_ar: 'موقف سيارات' },
  { name_en: 'Family Friendly', name_ar: 'مناسب للعائلة' },
  { name_en: 'Free WiFi', name_ar: 'واي فاي مجاني' },
  { name_en: 'Halal', name_ar: 'حلال' },
  { name_en: '24/7', name_ar: 'خدمة 24/7' },
  { name_en: 'Outdoor Seating', name_ar: 'جلسات خارجية' },
  { name_en: 'Reservations', name_ar: 'حجوزات' },
];

const SEED_INGESTION_SOURCES: Omit<
  IngestionSource,
  'id' | 'created_at' | 'created_by'
>[] = [
  {
    name: 'Restaurants in The Pearl',
    type: 'api_url',
    source_details: {
      url: 'https://overpass-api.de/api/interpreter?data=[out:json];node(25.36,51.53,25.38,51.55)[amenity=restaurant];out;',
    },
    frequency: 'manual',
    status: 'active',
  },
  {
    name: 'Supermarkets in Al Rayyan',
    type: 'api_url',
    source_details: {
      url: 'https://overpass-api.de/api/interpreter?data=[out:json];node(25.27,51.38,25.32,51.46)[shop=supermarket];out;',
    },
    frequency: 'manual',
    status: 'active',
  },
  {
    name: 'Pharmacies in Central Doha',
    type: 'api_url',
    source_details: {
      url: 'https://overpass-api.de/api/interpreter?data=[out:json];node(25.26,51.48,25.30,51.54)[amenity=pharmacy];out;',
    },
    frequency: 'manual',
    status: 'active',
  },
  {
    name: 'Banks in West Bay',
    type: 'api_url',
    source_details: {
      url: 'https://overpass-api.de/api/interpreter?data=[out:json];node(25.32,51.52,25.34,51.54)[amenity=bank];out;',
    },
    frequency: 'manual',
    status: 'active',
  },
  {
    name: 'Hotels in Doha',
    type: 'api_url',
    source_details: {
      url: 'https://overpass-api.de/api/interpreter?data=[out:json];node(25.25,51.48,25.35,51.55)[tourism=hotel];out;',
    },
    frequency: 'manual',
    status: 'active',
  },
];

function getSeedBusinesses(
  categoryIds: string[],
  tagIds: string[]
): Omit<Business, 'id'>[] {
  return [
    {
      slug: 'karak-mazaat-pearl',
      name_en: 'Karak Mazaat',
      name_ar: 'كرك مزايا',
      description_en: 'Authentic Qatari Karak and traditional snacks.',
      description_ar: 'أفضل كرك قطري أصيل ووجبات خفيفة تقليدية.',
      category_id: categoryIds[0]!,
      tag_ids: [tagIds[0]!, tagIds[2]!, tagIds[6]!],
      address_en: 'Porto Arabia, The Pearl-Qatar, Doha',
      address_ar: 'بورتو أرابيا، اللؤلؤة-قطر، الدوحة',
      geo: { lat: 25.375, lng: 51.545 },
      phone: '+974 4488 1234',
      website: 'https://karakmazaat.com',
      opening_hours: {
        'Sat-Thu': '7:00 AM - 11:00 PM',
        Friday: '8:00 AM - 12:00 AM',
      },
      price_range: '$',
      verified_status: true,
      status: 'active',
      rating: 4.5,
      review_count: 150,
      logo_id: 'business-logo-1',
      image_ids: ['business-profile-1'],
    },
    {
      slug: 'doha-festival-city',
      name_en: 'Doha Festival City',
      name_ar: 'الدوحة فستيفال سيتي',
      description_en: 'A world-class shopping destination with hundreds of brands.',
      description_ar: 'وجهة تسوق عالمية تضم مئات العلامات التجارية.',
      category_id: categoryIds[1]!,
      tag_ids: [tagIds[1]!, tagIds[2]!, tagIds[3]!],
      address_en: 'Umm Salal Muhammed, Doha',
      address_ar: 'أم صلال محمد، الدوحة',
      geo: { lat: 25.39, lng: 51.488 },
      phone: '+974 4035 4444',
      website: 'https://www.dohafestivalcity.com',
      opening_hours: { 'All Days': '10:00 AM - 12:00 AM' },
      price_range: '$$$',
      verified_status: true,
      status: 'active',
      rating: 4.8,
      review_count: 2300,
      logo_id: 'business-logo-2',
      image_ids: ['business-profile-2'],
    },
    {
      slug: 'sidra-medicine',
      name_en: 'Sidra Medicine',
      name_ar: 'مركز سدرة للطب',
      description_en:
        'A state-of-the-art hospital for women and children in Qatar.',
      description_ar: 'مستشفى حديث للنساء والأطفال في قطر.',
      category_id: categoryIds[2]!,
      tag_ids: [tagIds[1]!, tagIds[5]!],
      address_en: 'Al Gharrafa St, Ar-Rayyan',
      address_ar: 'شارع الغرافة، الريان',
      geo: { lat: 25.319, lng: 51.442 },
      phone: '+974 4003 3333',
      website: 'https://www.sidra.org',
      opening_hours: { 'All Days': '24 Hours' },
      price_range: '$$$$',
      verified_status: true,
      status: 'active',
      rating: 4.9,
      review_count: 850,
      logo_id: 'business-logo-3',
      image_ids: ['business-profile-4'],
    },
    // Add 8 more businesses
    {
      slug: 'qatar-national-library',
      name_en: 'Qatar National Library',
      name_ar: 'مكتبة قطر الوطنية',
      description_en:
        'A modern library with vast resources for research and learning.',
      description_ar: 'مكتبة عصرية ذات موارد هائلة للبحث والتعلم.',
      category_id: categoryIds[3]!,
      tag_ids: [tagIds[1]!, tagIds[3]!, tagIds[2]!],
      address_en: 'Education City, Al Rayyan',
      address_ar: 'المدينة التعليمية، الريان',
      geo: { lat: 25.318, lng: 51.443 },
      phone: '+974 4454 0100',
      website: 'https://www.qnl.qa',
      opening_hours: { 'Sat-Thu': '8:00 AM - 8:00 PM', Friday: 'Closed' },
      price_range: '$',
      verified_status: true,
      status: 'active',
      rating: 4.9,
      review_count: 1200,
      logo_id: 'business-logo-1',
      image_ids: [],
    },
    {
      slug: 'banana-island-resort',
      name_en: 'Banana Island Resort Doha',
      name_ar: 'منتجع جزيرة البنانا الدوحة',
      description_en:
        'A luxury island resort with overwater villas and family activities.',
      description_ar: 'منتجع جزيرة فاخر مع فيلات فوق الماء وأنشطة عائلية.',
      category_id: categoryIds[5]!,
      tag_ids: [tagIds[1]!, tagIds[2]!, tagIds[7]!],
      address_en: 'Banana Island, Doha',
      address_ar: 'جزيرة البنانا، الدوحة',
      geo: { lat: 25.26, lng: 51.649 },
      phone: '+974 4040 5050',
      website: 'https://www.anantara.com/en/banana-island-doha',
      opening_hours: { 'All Days': '24 Hours' },
      price_range: '$$$$',
      verified_status: true,
      status: 'active',
      rating: 4.7,
      review_count: 1500,
      logo_id: 'business-logo-2',
      image_ids: ['business-profile-3'],
    },
    {
      slug: 'al-watan-center',
      name_en: 'Al Watan Center',
      name_ar: 'مركز الوطن',
      description_en: 'Electronics and computer shops.',
      description_ar: 'محلات إلكترونيات وكمبيوتر.',
      category_id: categoryIds[1]!,
      tag_ids: [tagIds[1]!],
      address_en: 'Al Kinana Street, Doha',
      address_ar: 'شارع الكنانة، الدوحة',
      geo: { lat: 25.275, lng: 51.508 },
      phone: '+974 4433 5555',
      website: '',
      opening_hours: { 'Sat-Thu': '9:00 AM - 10:00 PM', Friday: '4:00 PM - 10:00 PM' },
      price_range: '$$',
      verified_status: false,
      status: 'active',
      rating: 4.1,
      review_count: 250,
      logo_id: 'business-logo-3',
      image_ids: ['business-profile-5'],
    },
     {
      slug: 'zara-villaggio',
      name_en: 'Zara - Villaggio Mall',
      name_ar: 'زارا - فيلاجيو مول',
      description_en: 'Latest trends in fashion for women, men and children.',
      description_ar: 'أحدث صيحات الموضة للنساء والرجال والأطفال',
      category_id: categoryIds[7]!,
      tag_ids: [tagIds[1]!],
      address_en: 'Villaggio Mall, Al Waab Street, Doha',
      address_ar: 'فيلاجيو مول، شارع الوعب، الدوحة',
      geo: { lat: 25.26, lng: 51.442 },
      phone: '+974 4450 7864',
      website: 'https://www.zara.com/qa/',
      opening_hours: { 'All Days': '10:00 AM - 11:00 PM' },
      price_range: '$$$',
      verified_status: true,
      status: 'active',
      rating: 4.4,
      review_count: 310,
      logo_id: 'business-logo-1',
      image_ids: ['business-profile-2'],
    },
     {
      slug: 'toyota-main-service',
      name_en: 'Toyota Main Service Center',
      name_ar: 'مركز خدمة تويوتا الرئيسي',
      description_en: 'Official Toyota and Lexus service center.',
      description_ar: 'مركز الخدمة الرسمي لتويوتا ولكزس.',
      category_id: categoryIds[4]!,
      tag_ids: [tagIds[1]!, tagIds[7]!],
      address_en: 'Street 1, Industrial Area, Doha',
      address_ar: 'شارع 1، المنطقة الصناعية، الدوحة',
      geo: { lat: 25.22, lng: 51.481 },
      phone: '+974 800 1800',
      website: 'https://www.toyota.com.qa',
      opening_hours: { 'Sun-Thu': '7:00 AM - 5:00 PM', 'Sat': '7:00 AM - 5:00 PM' },
      price_range: '$$$',
      verified_status: true,
      status: 'active',
      rating: 4.3,
      review_count: 980,
      logo_id: 'business-logo-2',
      image_ids: [],
    },
     {
      slug: 'blue-salon',
      name_en: 'Blue Salon',
      name_ar: 'الصالون الأزرق',
      description_en: 'Luxury department store offering high-end fashion, watches, and perfumes.',
      description_ar: 'متجر متعدد الأقسام فاخر يقدم أرقى الأزياء والساعات والعطور.',
      category_id: categoryIds[1]!,
      tag_ids: [tagIds[1]!],
      address_en: 'Suhaim Bin Hamad Street, Doha',
      address_ar: 'شارع سحيم بن حمد، الدوحة',
      geo: { lat: 25.28, lng: 51.506 },
      phone: '+974 4446 6111',
      website: 'https://www.bluesalon.com',
      opening_hours: { 'Sat-Thu': '9:00 AM - 10:00 PM', Friday: '4:00 PM - 10:00 PM' },
      price_range: '$$$$',
      verified_status: true,
      status: 'active',
      rating: 4.5,
      review_count: 420,
      logo_id: 'business-logo-3',
      image_ids: [],
    },
     {
      slug: 'ezdan-real-estate',
      name_en: 'Ezdan Real Estate',
      name_ar: 'إزدان العقارية',
      description_en: 'One of the largest real estate companies in Qatar, offering residential and commercial properties.',
      description_ar: 'من أكبر الشركات العقارية في قطر، تقدم عقارات سكنية وتجارية.',
      category_id: categoryIds[8]!,
      tag_ids: [tagIds[1]!],
      address_en: 'Ezdan Towers, West Bay, Doha',
      address_ar: 'أبراج إزدان، الخليج الغربي، الدوحة',
      geo: { lat: 25.328, lng: 51.528 },
      phone: '+974 4433 1111',
      website: 'https://www.ezdanrealestate.qa',
      opening_hours: { 'Sun-Thu': '8:00 AM - 5:00 PM' },
      price_range: '$$$',
      verified_status: true,
      status: 'active',
      rating: 3.9,
      review_count: 600,
      logo_id: 'business-logo-1',
      image_ids: ['business-profile-3'],
    },
     {
      slug: 'qatar-airways',
      name_en: 'Qatar Airways',
      name_ar: 'الخطوط الجوية القطرية',
      description_en: 'The state-owned flag carrier of Qatar.',
      description_ar: 'الناقل الوطني لدولة قطر.',
      category_id: categoryIds[11]!,
      tag_ids: [tagIds[7]!],
      address_en: 'Qatar Airways Tower 1, Doha',
      address_ar: 'برج الخطوط الجوية القطرية 1، الدوحة',
      geo: { lat: 25.259, lng: 51.536 },
      phone: '+974 4023 0000',
      website: 'https://www.qatarairways.com',
      opening_hours: { 'All Days': '24 Hours' },
      price_range: '$$$',
      verified_status: true,
      status: 'active',
      rating: 4.2,
      review_count: 15000,
      logo_id: 'business-logo-2',
      image_ids: [],
    },
  ];
}

export async function seedDatabase(db: Firestore) {
  try {
    const batch = writeBatch(db);

    // Seed Categories
    const categoryCol = collection(db, 'categories');
    const categoryPromises = SEED_CATEGORIES.map((cat) => addDoc(categoryCol, cat));
    const categoryDocs = await Promise.all(categoryPromises);
    const categoryIds = categoryDocs.map((doc) => doc.id);

    // Seed Tags
    const tagCol = collection(db, 'tags');
    const tagPromises = SEED_TAGS.map((tag) => addDoc(tagCol, tag));
    const tagDocs = await Promise.all(tagPromises);
    const tagIds = tagDocs.map((doc) => doc.id);

    // Get Businesses with dynamic IDs
    const businessesToSeed = getSeedBusinesses(categoryIds, tagIds);

    // Seed Businesses using a Write Batch for efficiency
    const businessCol = collection(db, 'businesses');
    businessesToSeed.forEach((business) => {
      const docRef = doc(businessCol);
      batch.set(docRef, business);
    });

    await batch.commit();
  } catch (error) {
    console.error('Error seeding database: ', error);
    // Optionally re-throw or handle the error as needed
    throw error;
  }
}

export async function seedIngestionSources(db: Firestore) {
  try {
    const batch = writeBatch(db);
    const sourcesCol = collection(db, 'ingestion_sources');
    SEED_INGESTION_SOURCES.forEach((source) => {
      const docRef = doc(sourcesCol);
      batch.set(docRef, {
        ...source,
        created_at: serverTimestamp(),
        created_by: 'system-seed',
      });
    });
    await batch.commit();
    console.log('Database seeding for ingestion sources complete.');
  } catch (error) {
    console.error('Error seeding ingestion sources: ', error);
    throw error;
  }
}
