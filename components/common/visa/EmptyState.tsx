import { SearchX } from 'lucide-react';
import { FC } from 'react';

const EmptyState: FC<{ title?: string; desc?: string }> = ({ title, desc }) => {
	return (
		<div className='flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-8 py-20 text-center shadow-sm'>
			<div className='mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-orange-100'>
				<SearchX className='h-10 w-10 text-primary' />
			</div>

			<h3 className='text-2xl font-bold text-slate-900'>
				{title || 'No Destinations Found'}
			</h3>

			<p className='mt-3 max-w-md text-slate-500'>
				{desc ||
					"We couldn't find any visa destinations matching your search. Try adjusting your keywords or browse all available countries."}
			</p>
		</div>
	);
};

export default EmptyState;
