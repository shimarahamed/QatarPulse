import type { LucideIcon } from 'lucide-react';

export type Category = {
  id: string;
  name_en: string;
  name_ar: string;
  icon: LucideIcon;
};

export type Tag = {
  id: string;
  name_en: string;
  name_ar: string;
};

export type Business = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  category_id: string;
  tag_ids: string[];
  address_en: string;
  address_ar: string;
  geo: {
    lat: number;
    lng: number;
  };
  phone: string;
  website: string;
  opening_hours: {
    [key: string]: string;
  };
  price_range: '$' | '$$' | '$$$' | '$$$$';
  verified_status: boolean;
  status: 'active' | 'closed';
  rating: number;
  review_count: number;
  logo_id: string;
  image_ids: string[];
};
