'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Calendar, Star, Users } from 'lucide-react';
import Link from 'next/link';

interface PackageCardProps {
	id: string;
	name: string;
	destination: string;
	description: string;
	price: number;
	discountedPrice?: number;
	duration: number;
	difficulty: 'Easy' | 'Moderate' | 'Hard';
	maxGroupSize?: number;
	rating: number;
	reviewCount: number;
	image?: string;
}

export function PackageCard({
	id,
	name,
	destination,
	description,
	price,
	discountedPrice,
	duration,
	difficulty,
	maxGroupSize,
	rating,
	reviewCount,
	image,
}: PackageCardProps) {
	const difficultyColors = {
		Easy: 'bg-green-100 text-green-800',
		Moderate: 'bg-yellow-100 text-yellow-800',
		Hard: 'bg-red-100 text-red-800',
	};

	return (
		<Card className='overflow-hidden hover:shadow-lg transition-shadow flex flex-col'>
			{/* Image */}
			{image && (
				<div className='w-full h-48 bg-muted overflow-hidden'>
					<img
						src={'@/assets/destination-japan.jpg'}
						alt={name}
						className='w-full h-full object-cover hover:scale-105 transition-transform'
					/>
				</div>
			)}

			{/* Content */}
			<CardHeader>
				<div className='space-y-2'>
					<CardDescription className='text-xs'>{destination}</CardDescription>
					<CardTitle className='text-lg'>{name}</CardTitle>
				</div>
			</CardHeader>

			<CardContent className='flex-1 flex flex-col'>
				<p className='text-sm text-foreground/70 line-clamp-2 mb-4'>
					{description}
				</p>

				{/* Details */}
				<div className='grid grid-cols-2 gap-2 mb-4 text-sm'>
					<div className='flex items-center gap-1'>
						<Calendar className='w-4 h-4 text-primary' />
						<span>{duration} days</span>
					</div>
					{maxGroupSize && (
						<div className='flex items-center gap-1'>
							<Users className='w-4 h-4 text-primary' />
							<span>Max {maxGroupSize}</span>
						</div>
					)}
					<div className='flex items-center gap-1'>
						<Star className='w-4 h-4 fill-primary text-primary' />
						<span>
							{rating.toFixed(1)} ({reviewCount})
						</span>
					</div>
					<Badge className={difficultyColors[difficulty]}>{difficulty}</Badge>
				</div>

				{/* Pricing */}
				<div className='mb-4 space-y-1'>
					<div className='flex items-baseline gap-2'>
						<span className='text-2xl font-bold text-primary'>
							${discountedPrice || price}
						</span>
						{discountedPrice && (
							<span className='text-sm text-foreground/60 line-through'>
								${price}
							</span>
						)}
					</div>
					<span className='text-xs text-foreground/60'>per person</span>
				</div>

				{/* Button */}
				<Button asChild className='w-full mt-auto'>
					<Link href={`/packages/${id}`}>View Details</Link>
				</Button>
			</CardContent>
		</Card>
	);
}
