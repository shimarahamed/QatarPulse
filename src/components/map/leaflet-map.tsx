'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Star } from 'lucide-react';

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  rating?: number;
  href?: string;
};

interface LeafletMapProps {
  markers: MapMarker[];
  /** Fallback center used when there are no markers (defaults to central Doha). */
  fallbackCenter?: [number, number];
  zoom?: number;
  className?: string;
}

// A pin-shaped divIcon rendered with an inline SVG so we don't depend on
// bundling Leaflet's default marker image assets through webpack.
const pinIcon = L.divIcon({
  className: '',
  html: `<svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 27 15 27s15-16.5 15-27c0-8.3-6.7-15-15-15z" fill="hsl(245 45% 40%)"/>
    <circle cx="15" cy="15" r="6" fill="white"/>
  </svg>`,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -38],
});

const DOHA_CENTER: [number, number] = [25.2854, 51.531];

export default function LeafletMap({
  markers,
  fallbackCenter = DOHA_CENTER,
  zoom = 12,
  className,
}: LeafletMapProps) {
  const center = useMemo<[number, number]>(() => {
    if (markers.length === 0) return fallbackCenter;
    const lat = markers.reduce((sum, m) => sum + m.lat, 0) / markers.length;
    const lng = markers.reduce((sum, m) => sum + m.lng, 0) / markers.length;
    return [lat, lng];
  }, [markers, fallbackCenter]);

  return (
    <MapContainer
      center={center}
      zoom={markers.length === 1 ? 15 : zoom}
      scrollWheelZoom={false}
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={pinIcon}>
          <Popup>
            <div className="space-y-1">
              <p className="font-semibold leading-tight">{marker.title}</p>
              {marker.subtitle && (
                <p className="text-xs text-muted-foreground">{marker.subtitle}</p>
              )}
              {typeof marker.rating === 'number' && (
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  {marker.rating.toFixed(1)}
                </div>
              )}
              {marker.href && (
                <Link href={marker.href} className="text-xs text-primary underline">
                  View details
                </Link>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
