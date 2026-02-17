'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heart } from 'lucide-react';
import {
  useUser,
  useFirestore,
  useDoc,
  useMemoFirebase,
  WithId,
  errorEmitter,
  FirestorePermissionError,
} from '@/firebase';
import { doc, getDocs, collection, query, where } from 'firebase/firestore';
import type { Business } from '@/lib/types';
import { useEffect, useState } from 'react';
import BusinessCard from '@/components/search/business-card';
import { Skeleton } from '@/components/ui/skeleton';

function FavoritesList() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [favoriteBusinesses, setFavoriteBusinesses] = useState<
    WithId<Business>[]
  >([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  const favoritesListRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}/lists/favorites`);
  }, [user, firestore]);

  const { data: favoriteList, isLoading: isLoadingList } =
    useDoc(favoritesListRef);

  useEffect(() => {
    if (favoriteList?.businessIds?.length > 0 && firestore) {
      const fetchBusinesses = async () => {
        setIsLoadingFavorites(true);
        try {
          const businessesRef = collection(firestore, 'businesses');
          const q = query(
            businessesRef,
            where('__name__', 'in', favoriteList.businessIds)
          );
          const querySnapshot = await getDocs(q);
          const businesses = querySnapshot.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as WithId<Business>)
          );
          setFavoriteBusinesses(businesses);
        } catch (e: any) {
          if (e.name === 'FirebaseError' && e.code === 'permission-denied') {
            const contextualError = new FirestorePermissionError({
              operation: 'list',
              path: `businesses`,
            });
            errorEmitter.emit('permission-error', contextualError);
          }
        } finally {
          setIsLoadingFavorites(false);
        }
      };
      fetchBusinesses();
    } else if (!isLoadingList) {
      setIsLoadingFavorites(false);
      setFavoriteBusinesses([]);
    }
  }, [favoriteList, isLoadingList, firestore]);

  if (isUserLoading || isLoadingList || isLoadingFavorites) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (!user) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-10 text-center">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium text-muted-foreground">
            Sign In Required
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in to see your favorite businesses.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (favoriteBusinesses.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-10 text-center">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium text-muted-foreground">
            No Favorites Yet
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Click the heart icon on a business page to save it here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {favoriteBusinesses.map((biz) => (
        <BusinessCard key={biz.id} business={biz} tags={[]} />
      ))}
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <div>
      <CardHeader>
        <CardTitle>My Favorites</CardTitle>
        <CardDescription>
          Businesses you've saved will appear here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FavoritesList />
      </CardContent>
    </div>
  );
}
