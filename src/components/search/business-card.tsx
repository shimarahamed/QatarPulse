import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  Globe,
} from 'lucide-react';
import type { Business, Category, Tag } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface BusinessCardProps {
  business: Business;
  category?: Category;
  tags: Tag[];
}

export default function BusinessCard({
  business,
  category,
  tags,
}: BusinessCardProps) {
  const logo = PlaceHolderImages.find((img) => img.id === business.logo_id);
  const isOpen = true; // Mock status

  const relevantHours = Object.values(business.opening_hours).find((h) =>
    h.includes(' - ')
  );
  const closingTime = relevantHours ? relevantHours.split(' - ')[1] : null;

  return (
    <Card className="flex flex-col md:flex-row overflow-hidden transition-shadow hover:shadow-lg">
      <div className="md:w-1/3 relative">
        <Link href={`/b/${business.slug}`}>
          <div className="aspect-[4/3] relative">
            {logo && (
              <Image
                src={logo.imageUrl}
                alt={business.name_en}
                fill
                className="object-cover"
                data-ai-hint="business logo"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-2 left-2">
              {business.verified_status && (
                <Badge
                  variant="default"
                  className="bg-accent text-accent-foreground"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </Link>
      </div>
      <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <div>
              {category && (
                <Link href={`/search?category=${category.id}`} className="text-sm text-primary font-medium">
                  {category.name_en}
                </Link>
              )}
              <h3 className="font-headline text-xl font-bold mt-1">
                <Link href={`/b/${business.slug}`}>{business.name_en}</Link>
              </h3>
              <p className="text-sm text-muted-foreground">{business.name_ar}</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
              <Star className="h-4 w-4" />
              <span>{business.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground mt-2 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{business.address_en}</span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <div
              className={`flex items-center gap-1 ${
                isOpen ? 'text-green-600' : 'text-red-600'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span className="font-medium">{isOpen ? 'Open' : 'Closed'}</span>
            </div>
            {closingTime && (
              <span className="text-muted-foreground">
                &bull; Closes at {closingTime}
              </span>
            )}
            <span className="text-muted-foreground font-bold">
              &bull; {business.price_range}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name_en}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <Button asChild size="sm">
            <Link href={`/b/${business.slug}`}>View Profile</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={`tel:${business.phone}`}>
              <Phone className="mr-2 h-4 w-4" />
              Call
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe className="mr-2 h-4 w-4" />
              Website
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}
