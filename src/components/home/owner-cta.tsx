import Link from 'next/link';
import { ArrowRight, BarChart3, Building2, ImagePlus, MessageSquareReply } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ownerPerks = [
  { icon: Building2, label: 'Claim ownership', body: 'Verify you run the business and take control of the page.' },
  { icon: ImagePlus, label: 'Add real photos', body: 'Upload a logo and gallery shots straight from your device.' },
  { icon: MessageSquareReply, label: 'Reply to reviews', body: 'Respond publicly to customer feedback as the owner.' },
  { icon: BarChart3, label: 'Keep details current', body: 'Update hours, services, phone and location any time.' },
];

export function OwnerCta() {
  return (
    <section className="bg-sand-deep py-24 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              For business owners
            </p>
            <h2 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] text-ink text-balance">
              Is your business on the map?
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              Listing on QatarPulse is free. Add a business that is missing, or
              claim one that is already listed and make it yours.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-ink px-7 text-sand hover:bg-ink/90"
              >
                <Link href="/submit-business">
                  Add your business <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-ink/25 px-7 hover:bg-background"
              >
                <Link href="/claim">Claim a listing</Link>
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Already claimed yours?{' '}
              <Link
                href="/account/my-businesses"
                className="font-medium text-ink underline underline-offset-4 hover:text-gold"
              >
                Go to your dashboard
              </Link>
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {ownerPerks.map((perk) => (
              <div
                key={perk.label}
                className="rounded-2xl border border-ink/10 bg-background p-6"
              >
                <perk.icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
                <h3 className="mt-4 font-headline text-base font-semibold text-ink">
                  {perk.label}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {perk.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
