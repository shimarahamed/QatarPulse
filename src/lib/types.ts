import type { LucideIcon } from 'lucide-react';
import type { Timestamp } from 'firebase/firestore';

export type WithId<T> = T & { id: string };

export type Category = {
  id: string;
  name_en: string;
  name_ar: string;
  icon_name: string;
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
  ownerId?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  submittedBy?: string;
  submittedAt?: Timestamp;
};

export type UserProfile = {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'user' | 'admin' | 'business-owner';
  createdAt: Timestamp;
};

export type BusinessClaim = {
  id: string;
  businessId: string;
  businessName: string;
  claimerName: string;
  claimerEmail: string;
  claimerPhone: string;
  claimerId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
};

export type IngestionSource = {
  id: string;
  name: string;
  type: 'api_url' | 'file_upload';
  source_details: {
    url?: string;
  };
  frequency: 'manual' | 'daily' | 'weekly';
  status: 'active' | 'inactive';
  last_run_at?: Timestamp;
  created_at: Timestamp;
  created_by: string;
};

export type IngestionJob = {
  id: string;
  source_id: string;
  source_name: string;
  triggered_at: Timestamp;
  triggered_by: 'manual' | 'scheduled';
  status: 'pending' | 'running' | 'completed' | 'failed';
  ended_at?: Timestamp;
  summary?: {
    records_processed: number;
    records_added: number;
    records_updated: number;
    errors: number;
  };
  error?: string;
};

export type Review = {
  id: string;
  businessId: string;
  businessName?: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;
  rating: number;
  text: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  status: 'pending' | 'approved' | 'rejected';
  ownerResponse?: {
    text: string;
    respondedAt: Timestamp;
  };
};
