'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { MapMarker } from './leaflet-map';

export type { MapMarker };

// Leaflet touches `window`/`document` on import, so it can only run client-side.
const LeafletMap = dynamic(() => import('./leaflet-map'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

interface BusinessMapProps {
  markers: MapMarker[];
  fallbackCenter?: [number, number];
  zoom?: number;
  className?: string;
}

export default function BusinessMap(props: BusinessMapProps) {
  return <LeafletMap {...props} />;
}
