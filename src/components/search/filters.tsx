'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Filter } from 'lucide-react';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Category, Tag } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function FiltersContent() {
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Component State for filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>(searchParams.getAll('category') || []);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>(searchParams.getAll('price') || []);
  const [minRating, setMinRating] = useState<number>(Number(searchParams.get('rating')) || 0);
  const [openNow, setOpenNow] = useState<boolean>(searchParams.get('openNow') === 'true');
  const [verified, setVerified] = useState<boolean>(searchParams.get('verified') === 'true');
  const [selectedTags, setSelectedTags] = useState<string[]>(searchParams.getAll('tag') || []);

  const categoriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'categories');
  }, [firestore]);
  const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesQuery);

  const tagsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'tags');
  }, [firestore]);
  const { data: tags, isLoading: isLoadingTags } = useCollection<Tag>(tagsQuery);
  
  // Handlers to update state
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories(prev => checked ? [...prev, categoryId] : prev.filter(id => id !== categoryId));
  };

  const handlePriceChange = (price: string, checked: boolean) => {
    setSelectedPriceRanges(prev => checked ? [...prev, price] : prev.filter(p => p !== price));
  };
  
  const handleTagChange = (tagId: string, checked: boolean) => {
    setSelectedTags(prev => checked ? [...prev, tagId] : prev.filter(id => id !== tagId));
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    selectedCategories.forEach(cat => params.append('category', cat));
    
    params.delete('price');
    selectedPriceRanges.forEach(price => params.append('price', price));
    
    params.delete('tag');
    selectedTags.forEach(tag => params.append('tag', tag));

    if (minRating > 0) {
      params.set('rating', String(minRating));
    } else {
      params.delete('rating');
    }

    if (openNow) {
      params.set('openNow', 'true');
    } else {
      params.delete('openNow');
    }
    
    if (verified) {
      params.set('verified', 'true');
    } else {
      params.delete('verified');
    }

    // Keep existing query `q` if it exists
    const q = searchParams.get('q');
    if (q) {
        params.set('q', q);
    }
    
    // Reset page to 1 when filters change
    params.set('page', '1');

    router.push(`/search?${params.toString()}`);
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams();
    const q = searchParams.get('q');
    if (q) {
        params.set('q', q);
    }
    router.push(`/search?${params.toString()}`);
  }

  const isLoading = isLoadingCategories || isLoadingTags;

  return (
    <div className="flex flex-col gap-6">
      <Accordion type="multiple" defaultValue={['category', 'price', 'rating', 'other']} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="font-headline text-base">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {isLoadingCategories && Array.from({length: 5}).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                </div>
              ))}
              {categories?.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`cat-${category.id}`} 
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, !!checked)}
                  />
                  <Label
                    htmlFor={`cat-${category.id}`}
                    className="font-normal text-sm"
                  >
                    {category.name_en}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger className="font-headline text-base">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {['$', '$$', '$$$', '$$$$'].map((price) => (
                <div key={price} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`price-${price}`}
                    checked={selectedPriceRanges.includes(price)}
                    onCheckedChange={(checked) => handlePriceChange(price, !!checked)}
                  />
                  <Label
                    htmlFor={`price-${price}`}
                    className="font-normal text-sm"
                  >
                    {price}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="rating">
          <AccordionTrigger className="font-headline text-base">
            Rating
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-1">
              <Slider value={[minRating]} onValueChange={(value) => setMinRating(value[0])} max={5} step={0.5} />
              <p className="text-sm text-muted-foreground mt-2">
                {minRating.toFixed(1)} and up
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="other">
          <AccordionTrigger className="font-headline text-base">
            More Filters
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="open-now" checked={openNow} onCheckedChange={(checked) => setOpenNow(!!checked)} />
                <Label htmlFor="open-now" className="font-normal text-sm">
                  Open Now
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="verified" checked={verified} onCheckedChange={(checked) => setVerified(!!checked)} />
                <Label htmlFor="verified" className="font-normal text-sm">
                  Verified
                </Label>
              </div>
              <div className="pt-2">
                <p className="font-medium text-sm mb-2">Tags</p>
                <div className="space-y-3">
                   {isLoadingTags && Array.from({length: 3}).map((_, i) => (
                    <div key={i} className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                  {tags?.map(tag => (
                     <div key={tag.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`tag-${tag.id}`}
                        checked={selectedTags.includes(tag.id)}
                        onCheckedChange={(checked) => handleTagChange(tag.id, !!checked)}
                      />
                      <Label htmlFor={`tag-${tag.id}`} className="font-normal text-sm">
                        {tag.name_en}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex flex-col gap-2">
        <Button onClick={handleApplyFilters}>Apply Filters</Button>
        <Button onClick={handleClearFilters} variant="ghost">Clear All</Button>
      </div>
    </div>
  );
}

export default function FiltersSidebar() {
  return (
    <>
      <div className="hidden md:block">
        <h2 className="font-headline text-xl font-bold mb-4">Filters</h2>
        <FiltersContent />
      </div>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
                <SheetTitle className="font-headline text-xl font-bold">Filters</SheetTitle>
            </SheetHeader>
            <div className="py-4">
                <FiltersContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
