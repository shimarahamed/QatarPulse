import { businesses, categories, tags } from '@/lib/data';
import { notFound } from 'next/navigation';
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
} from 'lucide-react';

export default function BusinessProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const business = businesses.find((b) => b.slug === params.slug);

  if (!business) {
    notFound();
  }

  const category = categories.find((c) => c.id === business.category_id);
  const businessTags = tags.filter((t) => business.tag_ids.includes(t.id));
  const galleryImages = business.image_ids.map(
    (id) => PlaceHolderImages.find((img) => img.id === id)!
  );
  const mapImage = PlaceHolderImages.find(
    (img) => img.id === 'map-placeholder'
  );

  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-0">
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
                  <div className="flex items-center gap-1.5 mt-2 sm:mt-0 text-amber-500">
                    {[...Array(Math.floor(business.rating))].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                    {[...Array(5 - Math.floor(business.rating))].map((_, i) => (
                      <Star key={i} className="h-5 w-5" />
                    ))}
                    <span className="text-foreground font-bold text-lg ml-2">
                      {business.rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      ({business.review_count} reviews)
                    </span>
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
                    {businessTags.map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name_en}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
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
                <Separator />
                <div className="flex flex-col gap-4 pt-2">
                  <Button>
                    <Phone className="h-4 w-4 mr-2" /> Call Now
                  </Button>
                  <Button variant="secondary">
                    <MessageCircle className="h-4 w-4 mr-2" /> Send Message
                  </Button>
                  <Button variant="outline">Claim this Business</Button>
                </div>
              </CardContent>
            </Card>

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
                        <span className="text-muted-foreground">{day}</span>
                        <span className="font-medium">{hours}</span>
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>

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
