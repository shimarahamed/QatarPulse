'use client'

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { ArrowRight, Building2, Search, UtensilsCrossed, Edit, BarChart } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { useCollection, useMemoFirebase } from '@/firebase';
import type { Category } from '@/lib/types';
import { iconMap } from '@/lib/icon-map';
import { collection, query, limit } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { searchAction } from './actions';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');
  const firestore = useFirestore();

  const categoriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'categories'), limit(10));
  }, [firestore]);
  
  const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesQuery);

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
            <form action={searchAction} className="flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto p-2 bg-background/20 rounded-lg">
              <div className="relative flex-grow w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  name="query"
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
            </form>
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
            {isLoadingCategories && Array.from({ length: 10 }).map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center aspect-square">
                        <Skeleton className="h-10 w-10 rounded-full mb-3" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16 mt-1" />
                    </CardContent>
                </Card>
            ))}
            {categories?.map((category) => {
              const Icon = iconMap[category.icon_name as keyof typeof iconMap] || UtensilsCrossed;
              return (
                <Link href={`/search?category=${category.id}`} key={category.id}>
                  <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 h-full">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center aspect-square">
                      <Icon
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
              )
            })}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link href="/categories">
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
                  <Link href="/claim">Claim a Listing</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <Card>
                  <CardContent className="p-6">
                      <h3 className="text-lg font-headline flex items-center gap-2 mb-2">
                        <Building2 className="h-6 w-6 text-accent" />
                        Claim
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Verify ownership and manage your business page.
                      </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                      <h3 className="text-lg font-headline flex items-center gap-2 mb-2">
                        <UtensilsCrossed className="h-6 w-6 text-accent" />
                        Update
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Keep your hours, services, and photos up-to-date.
                      </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
             <div className="flex justify-center md:order-last">
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <Card>
                  <CardContent className="p-6">
                      <h3 className="text-lg font-headline flex items-center gap-2 mb-2">
                        <Edit className="h-6 w-6 text-accent" />
                        Update Info
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Keep your profile, hours, and services current.
                      </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                      <h3 className="text-lg font-headline flex items-center gap-2 mb-2">
                        <BarChart className="h-6 w-6 text-accent" />
                        View Insights
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        See how many customers are viewing your page.
                      </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="space-y-4">
              <Badge variant="outline">Manage Your Page</Badge>
              <h2 className="font-headline text-3xl md:text-4xl font-bold">
                Already Claimed Your Business?
              </h2>
              <p className="text-muted-foreground text-lg">
                Log in to your dashboard to update your profile, respond to reviews, and see how customers are engaging with your page.
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <Link href="/account/my-businesses">Go to My Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
