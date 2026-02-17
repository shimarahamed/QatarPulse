'use client';

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
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Filter } from 'lucide-react';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function FiltersContent() {
  const firestore = useFirestore();
  const categoriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'categories');
  }, [firestore]);

  const { data: categories, isLoading } = useCollection<Category>(categoriesQuery);

  return (
    <div className="flex flex-col gap-6">
      <Accordion type="multiple" defaultValue={['category', 'price', 'rating']} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="font-headline text-base">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {isLoading && Array.from({length: 5}).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                </div>
              ))}
              {categories?.slice(0, 8).map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox id={`cat-${category.id}`} />
                  <Label
                    htmlFor={`cat-${category.id}`}
                    className="font-normal text-sm"
                  >
                    {category.name_en}
                  </Label>
                </div>
              ))}
              {(categories?.length || 0) > 8 && <Button variant="link" className="p-0 h-auto">
                Show all
              </Button>}
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
                  <Checkbox id={`price-${price}`} />
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
              <Slider defaultValue={[4]} max={5} step={0.5} />
              <p className="text-sm text-muted-foreground mt-2">
                4.0 and up
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
                <Checkbox id="open-now" />
                <Label htmlFor="open-now" className="font-normal text-sm">
                  Open Now
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="verified" />
                <Label htmlFor="verified" className="font-normal text-sm">
                  Verified
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="delivery" />
                <Label htmlFor="delivery" className="font-normal text-sm">
                  Delivery
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex flex-col gap-2">
        <Button>Apply Filters</Button>
        <Button variant="ghost">Clear All</Button>
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
            <h2 className="font-headline text-xl font-bold my-4">Filters</h2>
            <FiltersContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
