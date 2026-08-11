import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import type { Business, WithId } from '@/lib/types';

// Server-side (Node.js runtime) Firestore reads used for metadata/sitemap
// generation. Businesses and categories are publicly readable per
// firestore.rules, so this uses the same client SDK config rather than
// requiring a firebase-admin service account.
function getServerFirestore() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}

export async function getBusinessBySlug(slug: string): Promise<WithId<Business> | null> {
  try {
    const db = getServerFirestore();
    const q = query(collection(db, 'businesses'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    return { ...(docSnap.data() as Business), id: docSnap.id };
  } catch (error) {
    console.error('Failed to fetch business for metadata:', error);
    return null;
  }
}

export async function getAllBusinessSlugs(): Promise<WithId<Business>[]> {
  try {
    const db = getServerFirestore();
    const snapshot = await getDocs(collection(db, 'businesses'));
    return snapshot.docs.map((d) => ({ ...(d.data() as Business), id: d.id }));
  } catch (error) {
    console.error('Failed to fetch businesses for sitemap:', error);
    return [];
  }
}
