'use client';

import Link from 'next/link';
import Image from 'next/image';
import { collection, limit, orderBy, query } from 'firebase/firestore';
import { ArrowRight, CheckCircle2, MapPin, Star } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Business } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocalizedField } from '@/hooks/use-language';

export function FeaturedBusinesses() {
  const firestore = useFirestore();
  const localize = useLocalizedField();

  // Single-field orderBy — served by Firestore's automatic index, so this
  // needs no composite index deployment.
  const featuredQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'businesses'), orderBy('rating', 'desc'), limit(6));
  }, [firestore]);

  const { data: businesses, isLoading } = useCollection<Business>(featuredQuery);
  const featured = businesses?.filter((b) => b.status !== 'closed').slice(0, 6);

  if (!isLoading && (!featured || featured.length === 0)) return null;

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Top rated
            </p>
            <h2 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] text-ink text-balance">
              Where Qatar is going right now
            </h2>
          </div>
          <Button variant="ghost" asChild className="w-fit rounded-full">
            <Link href="/search">
              View all listings <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-ink/10">
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-52" />
                </div>
              </div>
            ))}

          {featured?.map((business) => {
            const imageUrl =
              business.logo_url ??
              PlaceHolderImages.find((img) => img.id === business.logo_id)?.imageUrl;

            return (
              <Link
                key={business.id}
                href={`/b/${business.slug}`}
                className="group overflow-hidden rounded-2xl border border-ink/10 bg-background transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(0,0,0,.06),0_12px_32px_rgba(0,0,0,.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={business.name_en}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No photo yet
                    </div>
                  )}

                  {typeof business.rating === 'number' && business.rating > 0 && (
                    <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-background/95 px-3 py-1 text-sm font-semibold shadow-sm backdrop-blur">
                      <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                      {business.rating.toFixed(1)}
                    </div>
                  )}
                  {business.verified_status && (
                    <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-ink/85 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-headline text-lg font-semibold leading-snug text-ink">
                    {localize(business.name_en, business.name_ar)}
                  </h3>
                  <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span className="line-clamp-1">
                      {localize(business.address_en, business.address_ar)}
                    </span>
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      {business.price_range || '—'}
                    </span>
                    <span className="text-sm font-medium text-gold">
                      {business.review_count || 0} reviews
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
