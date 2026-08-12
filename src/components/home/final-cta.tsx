import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-sand md:py-32">
      <div className="absolute inset-0 bg-grid opacity-[0.15]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--gold)/0.18),transparent_70%)]" />

      <div className="container relative px-4 text-center md:px-6">
        <h2 className="mx-auto max-w-3xl font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] tracking-[-0.02em] text-sand text-balance">
          Find your next
          <span className="italic text-gold"> favourite place</span> in Qatar
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-sand/60">
          Search thousands of listings across Doha and beyond — no account
          needed to start looking.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-gold px-8 text-base font-semibold text-ink hover:bg-gold/90"
          >
            <Link href="/search">
              Start searching <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-sand/25 bg-transparent px-8 text-base text-sand hover:bg-sand hover:text-ink"
          >
            <Link href="/categories">Browse categories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
