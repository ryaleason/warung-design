import type { MetadataRoute } from 'next';
import { getBundles } from '@/lib/db';

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.warungdesign.web.id';

  let bundleUrls: MetadataRoute.Sitemap = [];
  try {
    const bundles = await getBundles();
    bundleUrls = bundles.map((bundle) => ({
      url: `${baseUrl}/bundles/${bundle.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Failed to fetch bundles for sitemap:', error);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...bundleUrls,
  ];
}
