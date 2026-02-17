'use client';

import { useState } from 'react';
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

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  return (
    <div className="flex-1">
      <div className="container px-4 md:px-6 py-6">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-headline tracking-tight">
              Search Results
            </h1>
            <p className="text-muted-foreground">
              {businesses.length} businesses found in Doha
            </p>
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
            {businesses.map((business) => {
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
            })}
          </div>
        ) : (
          <MapView businesses={businesses} />
        )}

        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
