import { Card } from '@/components/ui/card';
import BusinessMap from '@/components/map/business-map';
import type { Business } from '@/lib/types';
import { useLocalizedField } from '@/hooks/use-language';

interface MapViewProps {
  businesses: Business[];
}

export default function MapView({ businesses }: MapViewProps) {
  const localize = useLocalizedField();
  const markers = businesses
    .filter((b) => b.geo && Number.isFinite(b.geo.lat) && Number.isFinite(b.geo.lng))
    .map((b) => ({
      id: b.id,
      lat: b.geo.lat,
      lng: b.geo.lng,
      title: localize(b.name_en, b.name_ar),
      subtitle: localize(b.address_en, b.address_ar),
      rating: b.rating,
      href: `/b/${b.slug}`,
    }));

  return (
    <Card className="w-full h-[600px] overflow-hidden">
      <BusinessMap markers={markers} className="h-full w-full" />
    </Card>
  );
}
