import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function VisaCountryCardSkeleton() {
	return (
		<Card className='border-0 shadow-soft overflow-hidden'>
			<CardContent className='p-4 text-center h-full flex flex-col items-center justify-center'>
				{/* Flag */}
				<Skeleton className='h-12 w-12 rounded-md mb-3' />

				{/* Country Name */}
				<Skeleton className='h-5 w-24 mb-2' />

				{/* Visa Type */}
				<Skeleton className='h-4 w-20 mb-2' />

				{/* Processing Time */}
				<Skeleton className='h-4 w-16' />
			</CardContent>
		</Card>
	);
}
