import { Skeleton } from '@/components/ui/skeleton';

export function PackageCardSkeleton() {
	return (
		<div className='overflow-hidden rounded-xl border bg-background'>
			{/* Image */}
			<Skeleton className='aspect-[16/10] w-full rounded-b-none' />

			<div className='space-y-4 p-5'>
				{/* Category */}
				<Skeleton className='h-4 w-20' />

				{/* Title */}
				<div className='space-y-2'>
					<Skeleton className='h-6 w-full' />
					<Skeleton className='h-6 w-3/4' />
				</div>

				{/* Excerpt */}
				<div className='flex gap-2'>
					<Skeleton className='h-4 w-3/4' />
					<Skeleton className='h-4 w-3/4' />
					<Skeleton className='h-4 w-3/4' />
				</div>

				{/* Author */}
				<div className='flex items-center justify-between'>
					<Skeleton className='h-4 w-24' />
					<Skeleton className='h-8 w-16' />
				</div>
			</div>
		</div>
	);
}
