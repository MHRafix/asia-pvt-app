'use client';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

export function DestinationSelector({ destination, setDestination }: any) {
	const [open, setOpen] = useState(false);

	const destinations = [
		{
			label: 'India',
			value: 'india',
		},
		{
			label: 'Nepal',
			value: 'nepal',
		},
		{
			label: 'Pakistan',
			value: 'pakistan',
		},
		{
			label: 'Singapore',
			value: 'singapore',
		},
		{
			label: 'Canada',
			value: 'canada',
		},
	];
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<p className='capitalize text-md my-2 font-bold text-primary cursor-pointer'>
					{destination || 'Where to ?'}
				</p>
			</PopoverTrigger>

			<PopoverContent className='w-80'>
				<div className='grid grid-cols-2 gap-3 !p-2'>
					{destinations?.map((d, i) => (
						<Button
							variant={destination === d?.value ? 'special' : 'outline'}
							key={i}
							onClick={() => {
								setDestination(d?.value);
								setOpen(false); // 👈 close popover here
							}}
						>
							{destination === d?.value && <CheckCircle />} {d?.label}
						</Button>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}
