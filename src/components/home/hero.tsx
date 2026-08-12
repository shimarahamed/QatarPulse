import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { searchAction } from '@/app/actions';

const quickSearches = [
  'Restaurants',
  'Cafes',
  'Shopping Malls',
  'Clinics',
  'Hotels',
  'Salons',
];

export function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  return (
    <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden bg-ink">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
        />
      )}

      {/* Layered scrim: keeps the skyline readable behind type without a flat wash. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/65 to-ink/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,transparent_10%,hsl(var(--ink)/0.6)_75%)]" />

      <div className="container relative z-10 px-4 py-24 md:px-6">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
            <MapPin className="h-3.5 w-3.5" />
            Doha &middot; Qatar
          </p>

          <h1 className="mt-6 font-display text-[clamp(3rem,8vw,6.5rem)] font-normal leading-[0.95] tracking-[-0.02em] text-white text-balance">
            Discover the best
            <span className="block italic text-gold">of Qatar.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 md:text-xl">
            Thousands of restaurants, clinics, shops and services across Doha
            and beyond — verified, reviewed, and searchable in English and
            Arabic.
          </p>

          <form
            action={searchAction}
            className="mt-10 flex flex-col gap-2 rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-md sm:flex-row"
          >
            <div className="relative w-full flex-grow">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                name="query"
                aria-label="Search businesses"
                placeholder="Try “karak near The Pearl” or “dentist in West Bay”"
                className="h-14 w-full rounded-xl border-0 bg-background pl-12 text-base text-foreground shadow-sm focus-visible:ring-2 focus-visible:ring-gold"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-14 rounded-xl bg-gold px-8 text-base font-semibold text-ink transition-transform duration-200 hover:scale-[1.02] hover:bg-gold/90"
            >
              Search
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-white/50">Popular:</span>
            {quickSearches.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/85 transition-colors duration-200 hover:border-gold hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
