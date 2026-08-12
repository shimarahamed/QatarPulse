import { Search, MapPinned, Star } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Search or browse',
    body: 'Filter by category, price, rating or amenities like parking, halal and free WiFi.',
    icon: Search,
  },
  {
    number: '02',
    title: 'See it on the map',
    body: 'Every listing is pinned, so you can find what is genuinely close to you.',
    icon: MapPinned,
  },
  {
    number: '03',
    title: 'Review and return',
    body: 'Rate what you visit, save favourites, and hear back from owners directly.',
    icon: Star,
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-sand md:py-32">
      <div className="absolute inset-0 bg-grid opacity-[0.15]" />

      <div className="container relative px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
            How it works
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] text-sand text-balance">
            Three steps from question to doorstep
          </h2>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-sand/15 bg-sand/10 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="bg-ink p-8 md:p-10">
              <div className="flex items-start justify-between">
                <span className="font-display text-6xl leading-none text-gold/80 md:text-7xl">
                  {step.number}
                </span>
                <step.icon className="h-6 w-6 text-sand/40" strokeWidth={1.5} />
              </div>
              <h3 className="mt-8 font-headline text-xl font-semibold text-sand">
                {step.title}
              </h3>
              <p className="mt-3 leading-relaxed text-sand/60">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
