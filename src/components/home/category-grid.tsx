'use client';

import Link from 'next/link';
import { collection, limit, query } from 'firebase/firestore';
import { ArrowRight, UtensilsCrossed } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { iconMap } from '@/lib/icon-map';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocalizedField } from '@/hooks/use-language';

export function CategoryGrid() {
  const firestore = useFirestore();
  const localize = useLocalizedField();

  const categoriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'categories'), limit(12));
  }, [firestore]);

  const { data: categories, isLoading } = useCollection<Category>(categoriesQuery);

  return (
    <section className="bg-sand py-24 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Browse
            </p>
            <h2 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] text-ink text-balance">
              Every category, one directory
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            From late-night karak stops to specialist clinics — start with what
            you need and narrow it down from there.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {isLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-ink/10 bg-background p-6"
              >
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="mt-6 h-5 w-28" />
                <Skeleton className="mt-2 h-3 w-16" />
              </div>
            ))}

          {categories?.map((category) => {
            const Icon =
              iconMap[category.icon_name as keyof typeof iconMap] || UtensilsCrossed;
            return (
              <Link
                key={category.id}
                href={`/search?category=${category.id}`}
                className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-background p-6 transition-all duration-200 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_1px_2px_rgba(0,0,0,.06),0_12px_32px_rgba(0,0,0,.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-gold/15 group-hover:text-gold">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 font-headline text-lg font-semibold leading-snug text-ink">
                  {localize(category.name_en, category.name_ar)}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground" dir="rtl">
                  {category.name_ar}
                </p>
                <ArrowRight className="absolute right-5 top-6 h-4 w-4 -translate-x-2 text-gold opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>

        <div className="mt-12">
          <Button
            variant="outline"
            asChild
            className="rounded-full border-ink/20 px-6 hover:bg-ink hover:text-sand"
          >
            <Link href="/categories">
              Explore all categories <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
