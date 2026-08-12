'use client';

import { useEffect, useState } from 'react';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

interface Counts {
  businesses: number;
  categories: number;
  verified: number;
}

export function StatsStrip() {
  const firestore = useFirestore();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!firestore) return;
    let cancelled = false;

    // If the backend is unreachable the SDK can retry indefinitely; cap the
    // wait so the strip collapses instead of showing skeletons forever.
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('count timeout')), 8000)
    );

    // Aggregation queries return server-side counts without reading every doc.
    Promise.race([
      Promise.all([
        getCountFromServer(collection(firestore, 'businesses')),
        getCountFromServer(collection(firestore, 'categories')),
        getCountFromServer(
          query(collection(firestore, 'businesses'), where('verified_status', '==', true))
        ),
      ]),
      timeout,
    ])
      .then(([businesses, categories, verified]) => {
        if (cancelled) return;
        setCounts({
          businesses: businesses.data().count,
          categories: categories.data().count,
          verified: verified.data().count,
        });
      })
      .catch(() => {
        // Never show invented numbers — drop the stats instead.
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [firestore]);

  if (failed) return null;

  const items = counts
    ? [
        { value: `${counts.businesses}+`, label: 'Businesses listed' },
        { value: `${counts.categories}`, label: 'Categories covered' },
        { value: `${counts.verified}`, label: 'Verified listings' },
        { value: 'EN / عربي', label: 'Fully bilingual' },
      ]
    : null;

  return (
    <section className="border-y border-ink/10 bg-sand-deep">
      <div className="container grid grid-cols-2 gap-x-6 gap-y-10 px-4 py-12 md:grid-cols-4 md:px-6">
        {items
          ? items.map((item) => (
              <div key={item.label} className="text-center md:text-left">
                <p className="font-display text-4xl leading-none tracking-tight text-ink md:text-5xl">
                  {item.value}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {item.label}
                </p>
              </div>
            ))
          : Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
      </div>
    </section>
  );
}
