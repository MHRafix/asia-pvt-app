import { CalendarClock } from 'lucide-react';

export default function MonthlyPlanAlert() {
	const today = new Date().getDate();

	// Show only on the 7th day of the month
	if (today !== 7) return null;

	return (
		<div className='fixed bottom-6 right-6 w-full max-w-md overflow-hidden rounded-2xl border border-red-200 bg-white shadow-2xl'>
			{/* Header */}
			<div className='flex items-center gap-3 border-b border-amber-100 bg-amber-50 px-5 py-4'>
				<div className='flex h-12 w-12 items-center justify-center rounded-full bg-amber-100'>
					<CalendarClock className='h-6 w-6 text-red-600' />
				</div>

				<div>
					<h2 className='text-lg font-semibold text-gray-900'>
						Monthly Plan Ending Soon
					</h2>
					<p className='text-sm text-gray-500'>
						Your subscription will expire at the end of this month.
					</p>
				</div>
			</div>

			{/* Body */}
			<div className='space-y-5 p-5'>
				{/* Remaining Time */}
				<div className='rounded-xl bg-gray-100 p-4'>
					<div className='mb-2 flex items-center justify-between text-sm'>
						<span className='font-medium text-gray-700'>Time Remaining</span>
						<span className='font-semibold text-red-600'>1 Day Left</span>
					</div>

					<div className='h-3 overflow-hidden rounded-full bg-gray-300'>
						<div
							className='h-full rounded-full bg-red-500'
							style={{ width: '98%' }}
						/>
					</div>
				</div>

				<p className='text-sm leading-6 text-gray-600'>
					Renew your monthly plan before it expires to keep your website,
					hosting, and services running without interruption.
				</p>

				{/* <div className='flex gap-3'>
					<button className='flex-1 rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition hover:bg-red-700'>
						Renew Plan
					</button>

					<button className='flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-gray-700 transition hover:bg-gray-100'>
						<RefreshCcw size={18} />
						View Plan
					</button>
				</div> */}
			</div>
		</div>
	);
}
