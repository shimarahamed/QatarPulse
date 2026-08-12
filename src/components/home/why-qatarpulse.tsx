import { Sparkles, Languages, ShieldCheck, MapPinned, MessageSquare, Heart } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Cleaned up by AI',
    body: 'Listings ingested from public sources are normalised, de-duplicated and categorised by Gemini before they ever reach the directory.',
  },
  {
    icon: Languages,
    title: 'Built bilingual',
    body: 'Names, descriptions and addresses are stored in both English and Arabic — switch language and the layout flips to right-to-left.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified ownership',
    body: 'Business owners claim their page through a reviewed process, so the details you see come from the people who run the place.',
  },
  {
    icon: MapPinned,
    title: 'Actually mapped',
    body: 'Every listing with coordinates appears on an interactive map, on both search results and the business page itself.',
  },
  {
    icon: MessageSquare,
    title: 'Moderated reviews',
    body: 'Ratings pass through a moderation queue, and owners can respond publicly to feedback on their listing.',
  },
  {
    icon: Heart,
    title: 'Saved for later',
    body: 'Keep a personal list of favourites and get notified when an owner replies to a review you left.',
  },
];

export function WhyQatarPulse() {
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Why QatarPulse
            </p>
            <h2 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] text-ink text-balance">
              A directory that maintains itself
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
              Most local directories rot — numbers change, places close, entries
              duplicate. QatarPulse pairs an automated ingestion pipeline with
              real owners and real reviewers to keep the data honest.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="bg-background p-7">
                <feature.icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
                <h3 className="mt-5 font-headline text-lg font-semibold text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
