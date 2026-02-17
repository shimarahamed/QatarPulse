import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Building2, Search, UtensilsCrossed } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { categories } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center text-center text-primary-foreground">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-primary/60" />
        <div className="relative z-10 container px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Discover the Best of Qatar
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80">
              Your ultimate guide to businesses, services, and places in Doha
              and beyond.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto p-2 bg-background/20 rounded-lg">
              <div className="relative flex-grow w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for restaurants, shops, services..."
                  className="w-full pl-10 text-base py-3 h-12 text-foreground bg-background focus:bg-background/90"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto h-12"
              >
                <span className="sm:hidden">Search</span>
                <Search className="hidden sm:block h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Browse by Category
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Explore a wide range of businesses and services curated for you.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.slice(0, 10).map((category) => (
              <Link href="#" key={category.id}>
                <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center aspect-square">
                    <category.icon
                      className="h-10 w-10 text-primary mb-3 transition-transform group-hover:scale-110"
                      strokeWidth={1.5}
                    />
                    <h3 className="font-headline text-base font-semibold">
                      {category.name_en}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {category.name_ar}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link href="#">
                Explore All Categories <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-4">
              <Badge variant="outline">For Business Owners</Badge>
              <h2 className="font-headline text-3xl md:text-4xl font-bold">
                Is your business listed?
              </h2>
              <p className="text-muted-foreground text-lg">
                Reach thousands of potential customers. Claim your free
                business listing on QatarPulse, update your profile, and connect
                with your audience.
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <Link href="/submit-business">Add Your Business</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href="#">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-headline flex items-center gap-2">
                      <Building2 className="h-6 w-6 text-accent" />
                      Claim
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Verify ownership and manage your business page.
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-headline flex items-center gap-2">
                      <UtensilsCrossed className="h-6 w-6 text-accent" />
                      Update
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Keep your hours, services, and photos up-to-date.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
