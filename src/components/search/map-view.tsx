import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Business } from '@/lib/types';

interface MapViewProps {
  businesses: Business[];
}

export default function MapView({ businesses }: MapViewProps) {
  const mapImage = PlaceHolderImages.find(
    (img) => img.id === 'map-placeholder'
  );

  return (
    <Card className="w-full h-[600px] overflow-hidden">
      <div className="relative w-full h-full">
        {mapImage && (
          <Image
            src={mapImage.imageUrl}
            alt="Map View"
            fill
            className="object-cover"
            data-ai-hint={mapImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/10"></div>
        {/* Here you would map over businesses and render map markers */}
      </div>
    </Card>
  );
}
