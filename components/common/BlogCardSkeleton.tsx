import { Skeleton } from '@/components/ui/skeleton';

export function BlogCardSkeleton() {
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
				<div className='space-y-2'>
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-2/3' />
				</div>

				{/* Author */}
				<div className='flex items-center gap-3 pt-2'>
					<Skeleton className='h-10 w-10 rounded-full' />
					<div className='space-y-2'>
						<Skeleton className='h-4 w-24' />
						<Skeleton className='h-3 w-16' />
					</div>
				</div>
			</div>
		</div>
	);
}
