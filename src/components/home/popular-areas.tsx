import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const areas = [
  { name: 'The Pearl-Qatar', name_ar: 'اللؤلؤة' },
  { name: 'West Bay', name_ar: 'الخليج الغربي' },
  { name: 'Souq Waqif', name_ar: 'سوق واقف' },
  { name: 'Lusail', name_ar: 'لوسيل' },
  { name: 'Msheireb Downtown', name_ar: 'مشيرب' },
  { name: 'Katara', name_ar: 'كتارا' },
  { name: 'Al Wakrah', name_ar: 'الوكرة' },
  { name: 'Education City', name_ar: 'المدينة التعليمية' },
];

// Mirrors the amenity tags seeded in src/lib/seed.ts.
const amenities = [
  'Free WiFi',
  'Halal',
  'Family Friendly',
  'Parking',
  '24/7',
  'Delivery Available',
  'Outdoor Seating',
  'Reservations',
];

export function PopularAreas() {
  return (
    <section className="bg-sand py-24 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
            Neighbourhoods
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] text-ink text-balance">
            Explore by where you are
          </h2>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((area) => (
            <Link
              key={area.name}
              href={`/search?q=${encodeURIComponent(area.name)}`}
              className="group flex items-center justify-between rounded-2xl border border-ink/10 bg-background p-6 transition-all duration-200 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_1px_2px_rgba(0,0,0,.06),0_12px_32px_rgba(0,0,0,.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <span>
                <span className="block font-headline text-lg font-semibold text-ink">
                  {area.name}
                </span>
                <span className="mt-0.5 block text-sm text-muted-foreground" dir="rtl">
                  {area.name_ar}
                </span>
              </span>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-colors duration-200 group-hover:text-gold" />
            </Link>
          ))}
        </div>
      </div>

      {/* Amenity marquee — a moment of motion between two dense grids. */}
      <div className="mt-20 flex overflow-hidden border-y border-ink/10 py-5">
        <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
          {[...amenities, ...amenities].map((amenity, i) => (
            <span
              key={`${amenity}-${i}`}
              className="flex shrink-0 items-center gap-10 font-headline text-sm uppercase tracking-[0.18em] text-ink/45"
            >
              {amenity}
              <span aria-hidden className="text-gold">
                &bull;
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
