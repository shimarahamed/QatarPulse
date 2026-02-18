'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Briefcase, Search } from 'lucide-react';
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
  WithId,
} from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Business } from '@/lib/types';
import BusinessCard from '@/components/search/business-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function OwnedBusinessesList() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const ownedBusinessesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'businesses'), where('ownerId', '==', user.uid));
  }, [user, firestore]);

  const { data: ownedBusinesses, isLoading } = useCollection<Business>(ownedBusinessesQuery);

  if (isUserLoading || isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (!user) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-10 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium text-muted-foreground">
            Sign In Required
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in to manage your businesses.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (ownedBusinesses?.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-10 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium text-muted-foreground">
            You don't own any businesses yet.
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Find your business on our directory to claim it and get started.
          </p>
           <Button asChild className="mt-4">
              <Link href="/search">
                <Search className="mr-2 h-4 w-4" />
                Find Your Business to Claim
              </Link>
            </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {ownedBusinesses?.map((biz) => (
        <BusinessCard key={biz.id} business={biz} tags={[]} />
      ))}
    </div>
  );
}


export default function MyBusinessesPage() {
  return (
    <div>
      <CardHeader>
        <CardTitle>My Businesses</CardTitle>
        <CardDescription>
          Here are the businesses you own and manage on QatarPulse.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OwnedBusinessesList />
      </CardContent>
    </div>
  );
}
