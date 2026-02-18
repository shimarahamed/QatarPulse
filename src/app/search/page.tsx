'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BusinessCard from '@/components/search/business-card';
import MapView from '@/components/search/map-view';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { List, Map, WifiOff } from 'lucide-react';
import type { Business, Category, Tag } from '@/lib/types';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  WithId,
  errorEmitter,
  FirestorePermissionError,
} from '@/firebase';
import {
  collection,
  query,
  where,
  limit,
  startAfter,
  getDocs,
  Query,
  DocumentData,
  and,
} from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 10;

// Helper to check if a business is open. This is a simplified example.
const isBusinessOpen = (business: Business): boolean => {
  if (!business.opening_hours) return false;
  
  const now = new Date();
  const dayOfWeek = now.toLocaleString('en-US', { weekday: 'short' }).toLowerCase(); // "mon", "tue", etc.
  const currentTime = now.getHours() * 100 + now.getMinutes(); // e.g., 1430 for 2:30 PM

  for (const [days, hours] of Object.entries(business.opening_hours)) {
    if (days.toLowerCase().includes(dayOfWeek)) {
       if (hours.toLowerCase() === '24 hours') return true;
       if (hours.toLowerCase() === 'closed') return false;

       const [startStr, endStr] = hours.split(' - ');
       if (!startStr || !endStr) continue;

       const parseTime = (timeStr: string) => {
         let [hour, minute] = timeStr.match(/\d+/g)!.map(Number);
         if (timeStr.toLowerCase().includes('pm') && hour !== 12) hour += 12;
         if (timeStr.toLowerCase().includes('am') && hour === 12) hour = 0;
         return hour! * 100 + (minute || 0);
       }
       
       const startTime = parseTime(startStr);
       const endTime = parseTime(endStr);

       if (startTime <= currentTime && currentTime < endTime) {
         return true;
       }
    }
  }

  return false;
}


function SearchResults() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const searchParams = useSearchParams();
  const firestore = useFirestore();

  const [businesses, setBusinesses] = React.useState<WithId<Business>[]>([]);
  const [allTags, setAllTags] = React.useState<WithId<Tag>[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Pagination state
  const page = Number(searchParams.get('page')) || 1;
  const [paginatedBusinesses, setPaginatedBusinesses] = React.useState<WithId<Business>[]>([]);
  const [totalPages, setTotalPages] = React.useState(0);

  // Load all tags once for client-side filtering and display
  const tagsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'tags') : null),
    [firestore]
  );
  const { data: tagsData } = useCollection<Tag>(tagsQuery);
   useEffect(() => {
    if (tagsData) setAllTags(tagsData);
  }, [tagsData]);


  useEffect(() => {
    if (!firestore) return;

    const fetchBusinesses = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const queryParam = searchParams.get('q') || '';
        const categoryIds = searchParams.getAll('category');
        const priceRanges = searchParams.getAll('price');
        const minRating = Number(searchParams.get('rating'));
        const openNow = searchParams.get('openNow') === 'true';
        const verified = searchParams.get('verified') === 'true';
        const tagIds = searchParams.getAll('tag');
        
        let q: Query<DocumentData> = collection(firestore, 'businesses');
        
        const constraints = [];
        if (categoryIds.length > 0) constraints.push(where('category_id', 'in', categoryIds));
        if (priceRanges.length > 0) constraints.push(where('price_range', 'in', priceRanges));
        if (minRating > 0) constraints.push(where('rating', '>=', minRating));
        if (verified) constraints.push(where('verified_status', '==', true));
        // Firestore limitation: Cannot use array-contains with 'in' or other array operations.
        // We will do tag filtering client-side.
        // If we could, it would be: if (tagIds.length > 0) constraints.push(where('tag_ids', 'array-contains-any', tagIds));
        
        // Note: Firestore doesn't support full-text search natively.
        // This is a basic "starts-with" search for demonstration.
        if (queryParam) {
           constraints.push(where('name_en', '>=', queryParam), where('name_en', '<=', queryParam + '\uf8ff'));
        }

        if(constraints.length > 0) {
            q = query(q, and(...constraints));
        }

        const querySnapshot = await getDocs(q);
        let bizData = querySnapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as WithId<Business>)
        );

        // --- Client-side filtering ---
        // For features Firestore can't query efficiently (e.g., OR on tags, time-based)
        if(tagIds.length > 0) {
            bizData = bizData.filter(biz => tagIds.every(tagId => biz.tag_ids?.includes(tagId)));
        }

        if (openNow) {
          bizData = bizData.filter(isBusinessOpen);
        }

        setBusinesses(bizData);

      } catch (e: any) {
        let errorMessage = 'An unexpected error occurred while searching.';
        if (e.name === 'FirebaseError') {
          if (e.code === 'permission-denied') {
            errorMessage = 'You do not have permission to view this data.';
             const contextualError = new FirestorePermissionError({ operation: 'list', path: `businesses` });
             errorEmitter.emit('permission-error', contextualError);
          } else if (e.code === 'failed-precondition') {
             errorMessage = 'The required index for this query is missing. Please create it in your Firebase console.';
          }
        }
        setError(errorMessage);
        setBusinesses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, [firestore, searchParams]);


  // Client-side pagination logic
   useEffect(() => {
    setTotalPages(Math.ceil(businesses.length / ITEMS_PER_PAGE));
    setPaginatedBusinesses(businesses.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    ));
  }, [businesses, page]);
  

  let title = 'Search Results';
  let description = `${businesses.length} businesses found`;
  if (isLoading) {
    description = 'Searching...';
  } else if (error) {
    description = 'Could not load results.'
  }

  // A more descriptive title will be added in a future step.

  return (
    <div className="flex-1">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-headline tracking-tight">
            {title}
          </h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="relevance">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Sort by: Relevance</SelectItem>
              <SelectItem value="distance">Sort by: Distance</SelectItem>
              <SelectItem value="rating">Sort by: Rating</SelectItem>
              <SelectItem value="newest">Sort by: Newest</SelectItem>
            </SelectContent>
          </Select>
          <div className="hidden sm:flex items-center rounded-md border bg-secondary p-1">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-background shadow-sm' : ''}
            >
              <List className="h-4 w-4" />
              <span className="ml-2">List</span>
            </Button>
            <Button
              variant={viewMode === 'map' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('map')}
              className={viewMode === 'map' ? 'bg-background shadow-sm' : ''}
            >
              <Map className="h-4 w-4" />
              <span className="ml-2">Map</span>
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="flex flex-col md:flex-row overflow-hidden">
              <Skeleton className="md:w-1/3 aspect-[4/3]" />
              <div className="p-6 flex-1">
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
         <Card className="border-dashed">
            <CardContent className="p-10 text-center">
              <WifiOff className="mx-auto h-12 w-12 text-destructive" />
              <h3 className="mt-4 text-lg font-medium text-destructive">
                Search Failed
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {error}
              </p>
            </CardContent>
          </Card>
      ) : viewMode === 'list' ? (
        <div className="grid grid-cols-1 gap-6">
          {paginatedBusinesses.length > 0 ? (
            paginatedBusinesses.map((business) => {
              const businessTags = allTags.filter((t) =>
                business.tag_ids?.includes(t.id)
              );
              return (
                <BusinessCard
                  key={business.id}
                  business={business}
                  tags={businessTags}
                />
              );
            })
          ) : (
            <p className="text-muted-foreground text-center py-10">
              No businesses found matching your criteria.
            </p>
          )}
        </div>
      ) : (
        <MapView businesses={businesses} />
      )}

      {!error && totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={page > 1 ? `/search?page=${page - 1}` : '#'}
                aria-disabled={page <= 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  href={`/search?page=${p}`}
                  isActive={p === page}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={page < totalPages ? `/search?page=${page + 1}` : '#'}
                aria-disabled={page >= totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex-1 space-y-4">
        <Skeleton className="h-8 w-1/2"/>
        <Skeleton className="h-48 w-full"/>
        <Skeleton className="h-48 w-full"/>
        <Skeleton className="h-48 w-full"/>
    </div>}>
      <SearchResults />
    </Suspense>
  );
}
