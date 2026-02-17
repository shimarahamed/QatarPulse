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
import { Card } from '@/components/ui/card';
import { List, Map } from 'lucide-react';
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
} from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 5;

function SearchResults() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const searchParams = useSearchParams();
  const firestore = useFirestore();

  const queryParam = searchParams.get('q') || '';
  const categoryId = searchParams.get('category');
  const page = Number(searchParams.get('page')) || 1;

  const [businesses, setBusinesses] = React.useState<WithId<Business>[]>([]);
  const [categories, setCategories] = React.useState<WithId<Category>[]>([]);
  const [tags, setTags] = React.useState<WithId<Tag>[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const categoriesQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'categories') : null),
    [firestore]
  );
  const { data: categoriesData } = useCollection<Category>(categoriesQuery);

  const tagsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'tags') : null),
    [firestore]
  );
  const { data: tagsData } = useCollection<Tag>(tagsQuery);

  useEffect(() => {
    if (categoriesData) setCategories(categoriesData);
  }, [categoriesData]);

  useEffect(() => {
    if (tagsData) setTags(tagsData);
  }, [tagsData]);

  useEffect(() => {
    if (!firestore) return;

    const fetchBusinesses = async () => {
      setIsLoading(true);

      let q: Query<DocumentData> = collection(firestore, 'businesses');

      if (categoryId) {
        q = query(q, where('category_id', '==', categoryId));
      }

      // Note: Firestore doesn't support full-text search natively.
      // This is a basic "starts-with" search for demonstration.
      // A production app would use Algolia/Typesense.
      if (queryParam) {
        q = query(
          q,
          where('name_en', '>=', queryParam),
          where('name_en', '<=', queryParam + '\uf8ff')
        );
      }

      try {
        const querySnapshot = await getDocs(q);
        const bizData = querySnapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as WithId<Business>)
        );
        setBusinesses(bizData);
      } catch (e: any) {
        if (e.name === 'FirebaseError' && e.code === 'permission-denied') {
          const contextualError = new FirestorePermissionError({
            operation: 'list',
            path: `businesses`,
          });
          errorEmitter.emit('permission-error', contextualError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, [firestore, queryParam, categoryId]);

  const categoryName = categoryId
    ? categories.find((c) => c.id === categoryId)?.name_en
    : null;

  // Client-side pagination for simplicity
  const totalPages = Math.ceil(businesses.length / ITEMS_PER_PAGE);
  const paginatedBusinesses = businesses.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  let title = 'Search Results';
  let description = `${businesses.length} businesses found`;

  if (queryParam && categoryName) {
    title = `'${queryParam}' in ${categoryName}`;
  } else if (queryParam) {
    title = `Results for '${queryParam}'`;
  } else if (categoryName) {
    title = categoryName;
    description = `${businesses.length} businesses in this category`;
  }

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
      ) : viewMode === 'list' ? (
        <div className="grid grid-cols-1 gap-6">
          {paginatedBusinesses.length > 0 ? (
            paginatedBusinesses.map((business) => {
              const category = categories.find(
                (c) => c.id === business.category_id
              );
              const businessTags = tags.filter((t) =>
                business.tag_ids?.includes(t.id)
              );
              return (
                <BusinessCard
                  key={business.id}
                  business={business}
                  category={category}
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

      {totalPages > 1 && (
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
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
