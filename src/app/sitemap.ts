import type { MetadataRoute } from 'next';
import { getAllBusinessSlugs } from '@/lib/server-firestore';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qatarpulse.app';

const staticRoutes = [
  '',
  '/search',
  '/categories',
  '/about',
  '/contact',
  '/submit-business',
  '/claim',
  '/legal/privacy',
  '/legal/terms',
  '/legal/data-sources',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const businesses = await getAllBusinessSlugs();

  const businessEntries: MetadataRoute.Sitemap = businesses
    .filter((b) => b.status === 'active' && b.slug)
    .map((b) => ({
      url: `${siteUrl}/b/${b.slug}`,
      lastModified: b.updatedAt?.toDate?.() ?? undefined,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.6,
  }));

  return [...staticEntries, ...businessEntries];
}
