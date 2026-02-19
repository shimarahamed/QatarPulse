'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Clock,
  CheckCircle2,
  MessageCircle,
  Heart,
} from 'lucide-react';
import type { Business, Category, Tag } from '@/lib/types';
import {
  useFirestore,
  useMemoFirebase,
  useUser,
  WithId,
  updateDocumentNonBlocking,
  setDocumentNonBlocking,
  errorEmitter,
  FirestorePermissionError,
} from '@/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  arrayUnion,
  arrayRemove,
  getDoc,
  limit,
} from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { iconMap } from '@/lib/icon-map';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ReviewsSection from '@/components/reviews/reviews-section';

export default function BusinessProfilePage() {
  const params = useParams<{ slug: string }>();
  const [business, setBusiness] = useState<WithId<Business> | null>(null);
  const [category, setCategory] = useState<WithId<Category> | null>(null);
  const [tags, setTags] = useState<WithId<Tag>[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (!firestore || !params.slug) return;

    setIsLoading(true);

    const businessesCol = collection(firestore, 'businesses');
    const q = query(
      businessesCol,
      where('slug', '==', params.slug),
      limit(1)
    );

    getDocs(q)
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          setIsLoading(false);
          notFound();
          return;
        }

        const bizDoc = querySnapshot.docs[0];
        const bizData = { ...bizDoc.data(), id: bizDoc.id } as WithId<Business>;
        setBusiness(bizData);

        // Chain promises for fetching related data
        if (bizData.category_id) {
          const catRef = doc(firestore, 'categories', bizData.category_id);
          getDoc(catRef)
            .then((catDoc) => {
              if (catDoc && catDoc.exists()) {
                setCategory({
                  ...catDoc.data(),
                  id: catDoc.id,
                } as WithId<Category>);
              }
            })
            .catch((error) => {
              const contextualError = new FirestorePermissionError({
                operation: 'get',
                path: catRef.path,
              });
              errorEmitter.emit('permission-error', contextualError);
            });
        }

        if (bizData.tag_ids && bizData.tag_ids.length > 0) {
          const tagsQuery = query(
            collection(firestore, 'tags'),
            where('__name__', 'in', bizData.tag_ids)
          );
          getDocs(tagsQuery)
            .then((tagsSnapshot) => {
              if (tagsSnapshot) {
                setTags(
                  tagsSnapshot.docs.map(
                    (d) => ({ ...d.data(), id: d.id } as WithId<Tag>)
                  )
                );
              }
            })
            .catch((error) => {
              const contextualError = new FirestorePermissionError({
                operation: 'list',
                path: 'tags',
              });
              errorEmitter.emit('permission-error', contextualError);
            });
        }
      })
      .catch((error) => {
        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path: 'businesses',
        });
        errorEmitter.emit('permission-error', contextualError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [firestore, params.slug]);

  // Check if it's a favorite
  useEffect(() => {
    if (user && business && firestore) {
      const favListRef = doc(firestore, `users/${user.uid}/lists/favorites`);
      getDoc(favListRef)
        .then((docSnap) => {
          if (
            docSnap.exists() &&
            docSnap.data().businessIds?.includes(business.id)
          ) {
            setIsFavorite(true);
          } else {
            setIsFavorite(false);
          }
        })
        .catch((e) => {
          const contextualError = new FirestorePermissionError({
            operation: 'get',
            path: favListRef.path,
          });
          errorEmitter.emit('permission-error', contextualError);
        });
    }
  }, [user, business, firestore]);

  const toggleFavorite = () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not signed in',
        description: 'You need to be signed in to add favorites.',
      });
      return;
    }
    if (!business || !firestore) return;

    const favListRef = doc(firestore, `users/${user.uid}/lists/favorites`);

    if (isFavorite) {
      updateDocumentNonBlocking(favListRef, {
        businessIds: arrayRemove(business.id),
      });
      toast({ title: 'Removed from Favorites' });
    } else {
      setDocumentNonBlocking(
        favListRef,
        {
          name: 'Favorites',
          businessIds: arrayUnion(business.id),
        },
        { merge: true }
      );
      toast({ title: 'Added to Favorites' });
    }
    setIsFavorite(!isFavorite);
  };

  if (isLoading) {
    return (
      <div className="bg-secondary">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card>
                <Skeleton className="w-full aspect-[16/9] rounded-t-lg" />
                <div className="p-6">
                  <Skeleton className="h-6 w-1/4 mb-2" />
                  <Skeleton className="h-10 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-1/2 mb-6" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </Card>
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-10 w-full mt-4" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return notFound();
  }

  const galleryImages =
    business.image_ids
      ?.map((id) => PlaceHolderImages.find((img) => img.id === id)!)
      .filter(Boolean) || [];
  const mapImage = PlaceHolderImages.find(
    (img) => img.id === 'map-placeholder'
  );
  const relevantHours = business.opening_hours
    ? Object.values(business.opening_hours).find((h) => h.includes(' - '))
    : null;
  const closingTime = relevantHours ? relevantHours.split(' - ')[1] : null;

  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-0">
                {galleryImages.length > 0 ? (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {galleryImages.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="aspect-[16/9] relative rounded-t-lg overflow-hidden">
                            <Image
                              src={image.imageUrl}
                              alt={image.description}
                              fill
                              className="object-cover"
                              data-ai-hint={image.imageHint}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </Carousel>
                ) : (
                  <div className="aspect-[16/9] relative rounded-t-lg overflow-hidden bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">No images available</p>
                  </div>
                )}
              </CardContent>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                  <div>
                    {category && (
                      <p className="text-primary font-semibold">
                        {category.name_en}
                      </p>
                    )}
                    <h1 className="font-headline text-3xl md:text-4xl font-bold mt-1">
                      {business.name_en}
                    </h1>
                    <h2 className="text-lg text-muted-foreground">
                      {business.name_ar}
                    </h2>
                  </div>
                  <div className="flex items-center gap-4 mt-2 sm:mt-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFavorite}
                      disabled={isUserLoading}
                    >
                      <Heart
                        className={cn(
                          'h-6 w-6',
                          isFavorite && 'fill-red-500 text-red-500'
                        )}
                      />
                    </Button>
                    <div className="flex items-center gap-1.5 text-amber-500">
                      <Star className="h-5 w-5 fill-current" />
                      <span className="text-foreground font-bold text-lg ml-1">
                        {business.rating?.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        ({business.review_count} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {business.verified_status && (
                  <div className="mt-4 flex items-center">
                    <Badge className="bg-accent text-accent-foreground">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Verified Listing
                    </Badge>
                  </div>
                )}
                <Separator className="my-6" />
                <div>
                  <h3 className="font-headline text-xl font-semibold mb-2">
                    About
                  </h3>
                  <p className="text-muted-foreground">
                    {business.description_en}
                  </p>
                </div>
                <Separator className="my-6" />
                <div className="mt-4">
                  <h3 className="font-headline text-xl font-semibold mb-4">
                    Services & Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name_en}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            
            <ReviewsSection business={business} />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Contact & Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p>{business.address_en}</p>
                    <p className="text-muted-foreground">
                      {business.address_ar}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                  <a href={`tel:${business.phone}`} className="hover:underline">
                    {business.phone}
                  </a>
                </div>
                {business.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-3 text-muted-foreground" />
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-primary"
                    >
                      {business.website.replace('https://', '')}
                    </a>
                  </div>
                )}
                <Separator />
                <div className="flex flex-col gap-4 pt-2">
                  <Button asChild>
                    <a href={`tel:${business.phone}`}>
                      <Phone className="h-4 w-4 mr-2" /> Call Now
                    </a>
                  </Button>
                  <Button variant="secondary">
                    <MessageCircle className="h-4 w-4 mr-2" /> Send Message
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/claim?businessId=${business.id}`}>
                      Claim this Business
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {business.opening_hours && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Opening Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {Object.entries(business.opening_hours).map(
                      ([day, hours]) => (
                        <li key={day} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">
                            {day}
                          </span>
                          <span className="font-medium">{hours}</span>
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="font-headline">Location</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-64 relative">
                  {mapImage && (
                    <Image
                      src={mapImage.imageUrl}
                      alt="Map location"
                      fill
                      className="object-cover"
                      data-ai-hint={mapImage.imageHint}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
