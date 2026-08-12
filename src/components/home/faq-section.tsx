'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'Is it free to list my business?',
    a: 'Yes. Adding a business and claiming an existing listing are both free. Submissions are reviewed by our team before they appear in the directory.',
  },
  {
    q: 'How do I claim a business that is already listed?',
    a: 'Find the business on the site and use the “Claim this Business” button on its profile page. An admin reviews the claim, and you are notified in-app once it is approved.',
  },
  {
    q: 'Where does the business data come from?',
    a: 'Listings come from a mix of owner submissions and public sources such as OpenStreetMap. Imported data is normalised and checked for duplicates before publishing — see our Data Sources page for details.',
  },
  {
    q: 'Can I use the site in Arabic?',
    a: 'Yes. Switch language from the globe icon in the header or from your account settings. Business names, descriptions and addresses show their Arabic versions and the layout switches to right-to-left.',
  },
  {
    q: 'How are reviews moderated?',
    a: 'Every review enters a moderation queue before it goes public. Business owners can publicly respond to reviews on listings they have claimed.',
  },
  {
    q: 'Something is wrong with a listing. How do I fix it?',
    a: 'If you own the business, claim it and edit the details directly. Otherwise, use the contact form and we will look into it.',
  },
];

export function FaqSection() {
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Questions
            </p>
            <h2 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] text-ink text-balance">
              Good to know
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q} className="border-ink/10">
                <AccordionTrigger className="text-left font-headline text-base font-semibold text-ink hover:text-gold hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
