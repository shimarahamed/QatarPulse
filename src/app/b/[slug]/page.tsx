import type { Metadata } from 'next';
import { getBusinessBySlug } from '@/lib/server-firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import BusinessProfileClient from './business-profile-client';

interface BusinessPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    return { title: 'Business Not Found' };
  }

  // `title` is just the business name — the root layout's title template
  // ("%s | QatarPulse") appends the suffix automatically. openGraph/twitter
  // titles aren't subject to that template, so they spell it out in full.
  const title = business.name_en;
  const socialTitle = `${business.name_en} | QatarPulse`;
  const description =
    business.description_en?.slice(0, 160) ||
    `Find contact info, opening hours, and reviews for ${business.name_en} on QatarPulse — Qatar's business directory.`;
  const logoUrl =
    business.logo_url ?? PlaceHolderImages.find((img) => img.id === business.logo_id)?.imageUrl;

  return {
    title,
    description,
    openGraph: {
      title: socialTitle,
      description,
      type: 'website',
      images: logoUrl ? [{ url: logoUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: logoUrl ? [logoUrl] : undefined,
    },
  };
}

export default function BusinessPage() {
  return <BusinessProfileClient />;
}
