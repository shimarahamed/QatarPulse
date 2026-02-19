'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { Edit, MessageSquare, ArrowLeft } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Business } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';

export default function BusinessManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const businessId = params.businessId as string;
  const firestore = useFirestore();

  const businessRef = useMemoFirebase(() => {
    if (!firestore || !businessId) return null;
    return doc(firestore, 'businesses', businessId);
  }, [firestore, businessId]);

  const { data: business, isLoading } = useDoc<Business>(businessRef);

  const navItems = [
    { href: `/account/my-businesses/${businessId}/edit`, label: 'Edit Info', icon: Edit },
    { href: `/account/my-businesses/${businessId}/reviews`, label: 'Manage Reviews', icon: MessageSquare },
  ];

  return (
    <div>
       <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="icon" asChild>
              <Link href="/account/my-businesses">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back to My Businesses</span>
              </Link>
          </Button>
          <div>
          {isLoading ? (
              <>
                  <Skeleton className="h-7 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
              </>
          ) : (
              <>
                  <h1 className="text-2xl font-bold font-headline">Manage: {business?.name_en}</h1>
                  <p className="text-muted-foreground">Update your business details and engage with customers.</p>
              </>
          )}
          </div>
      </div>
      <Tabs value={pathname} onValueChange={(value) => router.push(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
               <TabsTrigger value={`/account/my-businesses/${businessId}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Info
                </TabsTrigger>
                <TabsTrigger value={`/account/my-businesses/${businessId}/reviews`}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Manage Reviews
                </TabsTrigger>
          </TabsList>
      </Tabs>
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}
