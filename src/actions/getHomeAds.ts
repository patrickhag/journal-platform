import { db } from '@/db/db';
import { ads } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const getHomeAds = async () => {
  try {
    return await db.query.ads.findMany({
      where: eq(ads.isActive, true),
    });
  } catch (error) {
    console.error('Failed to fetch home ads', error);
    return [];
  }
};
