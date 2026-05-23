'use client';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';
import { Calendar } from '../ui/calendar';

export function DateSelector() {
	const [open, setOpen] = useState(false);
	const [date, setDate] = useState<Date | undefined>();

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<p className='capitalize text-md my-2 font-bold text-primary cursor-pointer'>
					{date ? date.toDateString() : 'Select date ?'}
				</p>
			</PopoverTrigger>

			<PopoverContent className='w-80'>
				<Calendar
					mode='single'
					selected={date}
					onSelect={(selectedDate) => {
						setDate(selectedDate);
						setOpen(false);
					}}
					className='rounded-lg border w-full'
					captionLayout='dropdown'
				/>
			</PopoverContent>
		</Popover>
	);
}
