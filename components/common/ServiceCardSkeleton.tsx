import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ServiceCardSkeleton() {
	return (
		<Card className='border-0 shadow-soft h-full'>
			<CardContent className='p-6'>
				{/* Icon */}
				<Skeleton className='w-14 h-14 rounded-2xl mb-4' />

				{/* Title */}
				<Skeleton className='h-7 w-3/4 mb-2' />

				{/* Description */}
				<div className='space-y-2 mb-4'>
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-2/3' />
				</div>

				{/* Footer */}
				<div className='flex items-center justify-between'>
					<Skeleton className='h-4 w-20' />
					<Skeleton className='w-5 h-5 rounded-full' />
				</div>
			</CardContent>
		</Card>
	);
}
