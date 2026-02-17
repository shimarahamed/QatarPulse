'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { businesses, tags, categories } from '@/lib/data';
import BusinessCard from '@/components/search/business-card';
import MapView from '@/components/search/map-view';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { List, Map } from 'lucide-react';
import type { Business } from '@/lib/types';

function SearchResults() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const searchParams = useSearchParams();

  const query = searchParams.get('q') || '';
  const categoryId = searchParams.get('category');
  
  const categoryName = categoryId ? categories.find(c => c.id === categoryId)?.name_en : null;
  const page = Number(searchParams.get('page')) || 1;
  const itemsPerPage = 5;

  const filteredBusinesses = businesses.filter(business => {
    const matchesCategory = categoryId ? business.category_id === categoryId : true;
    const matchesQuery = query ? 
      business.name_en.toLowerCase().includes(query.toLowerCase()) ||
      business.description_en.toLowerCase().includes(query.toLowerCase())
      : true;
    return matchesCategory && matchesQuery;
  });

  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);
  const paginatedBusinesses = filteredBusinesses.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  let title = "Search Results";
  let description = `${filteredBusinesses.length} businesses found`;

  if(query && categoryName) {
    title = `'${query}' in ${categoryName}`;
  } else if (query) {
    title = `Results for '${query}'`;
  } else if (categoryName) {
    title = categoryName;
    description = `${filteredBusinesses.length} businesses in this category`;
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
              className={
                viewMode === 'list' ? 'bg-background shadow-sm' : ''
              }
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

      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 gap-6">
          {paginatedBusinesses.length > 0 ? paginatedBusinesses.map((business) => {
            const category = categories.find(
              (c) => c.id === business.category_id
            );
            const businessTags = tags.filter((t) =>
              business.tag_ids.includes(t.id)
            );
            return (
              <BusinessCard
                key={business.id}
                business={business}
                category={category}
                tags={businessTags}
              />
            );
          }) : (
            <p className='text-muted-foreground text-center py-10'>No businesses found matching your criteria.</p>
          )}
        </div>
      ) : (
        <MapView businesses={filteredBusinesses} />
      )}

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={page > 1 ? `/search?page=${page - 1}` : '#'} aria-disabled={page <= 1}/>
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                 <PaginationItem key={p}>
                    <PaginationLink href={`/search?page=${p}`} isActive={p === page}>
                        {p}
                    </PaginationLink>
                </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href={page < totalPages ? `/search?page=${page + 1}` : '#'} aria-disabled={page >= totalPages}/>
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
    )
}
