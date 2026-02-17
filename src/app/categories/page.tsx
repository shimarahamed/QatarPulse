'use client';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Category } from '@/lib/types';
import { collection } from 'firebase/firestore';
import { iconMap } from '@/lib/data';
import { UtensilsCrossed } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


export default function CategoriesPage() {
    const firestore = useFirestore();
    const categoriesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'categories');
    }, [firestore]);

    const { data: categories, isLoading } = useCollection<Category>(categoriesQuery);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          All Categories
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Explore the wide variety of businesses and services available across Qatar.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {isLoading && Array.from({length: 12}).map((_, i) => (
             <Card key={i}>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center aspect-square">
                    <Skeleton className="h-10 w-10 rounded-full mb-3" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16 mt-1" />
                </CardContent>
            </Card>
        ))}
        {categories?.map((category) => {
            const Icon = iconMap[category.icon_name as keyof typeof iconMap] || UtensilsCrossed;
            return (
          <Link href={`/search?category=${category.id}`} key={category.id}>
            <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center aspect-square">
                <Icon
                  className="h-10 w-10 text-primary mb-3 transition-transform group-hover:scale-110"
                  strokeWidth={1.5}
                />
                <h3 className="font-headline text-base font-semibold">
                  {category.name_en}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {category.name_ar}
                </p>
              </CardContent>
            </Card>
          </Link>
        )})}
      </div>
    </div>
  );
}
