'use client';

import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DestinationCardProps {
  id: string;
  name: string;
  country: string;
  description: string;
  image?: string;
  rating: number;
  reviewCount: number;
}

export function DestinationCard({
  id,
  name,
  country,
  description,
  image,
  rating,
  reviewCount,
}: DestinationCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      {image && (
        <div className="w-full h-40 bg-muted overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </div>
      )}

      {/* Content */}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {country}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            <span className="text-xs text-foreground/60">({reviewCount})</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-foreground/70 line-clamp-2 mb-4">{description}</p>
        <Button asChild className="w-full">
          <Link href={`/destinations/${id}`}>
            Explore
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
